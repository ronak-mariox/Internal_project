import crypto from 'node:crypto';
import { RefreshToken } from '../models/RefreshToken';
import { env } from './env';
import { signAccessToken, signRefreshToken, verifyRefreshToken, type Role } from './jwt';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** Issues a fresh access+refresh pair and persists the refresh token (hashed). */
export async function issueTokenPair(userId: string, role: Role): Promise<TokenPair> {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId, role });

  const expiresAt = new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ tokenHash: hashToken(refreshToken), userId, role, expiresAt });

  return { accessToken, refreshToken };
}

/**
 * Verifies a refresh token, rotates it (revokes the old row, issues a new pair),
 * and returns the new pair. Throws if the token is invalid, expired, or already revoked
 * (which also signals possible token theft — all sessions for that row are cut off).
 */
export async function rotateTokenPair(refreshToken: string): Promise<TokenPair> {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new Error('Refresh token is invalid or has expired');
  }

  const next = await issueTokenPair(payload.sub, payload.role as Role);
  stored.revokedAt = new Date();
  stored.replacedBy = hashToken(next.refreshToken);
  await stored.save();

  return next;
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await RefreshToken.updateOne({ tokenHash, revokedAt: null }, { revokedAt: new Date() });
}
