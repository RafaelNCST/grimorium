import { IConnection, ConnectionType } from '../types/power-system-types';
import { DEFAULT_CONNECTION_COLOR } from '../constants/default-colors-constant';

export function createArrowConnection(
  fromElementId: string,
  toX: number,
  toY: number
): IConnection {
  const now = Date.now();

  return {
    id: `arrow-${now}`,
    type: 'arrow',
    fromElementId,
    toX,
    toY,
    color: DEFAULT_CONNECTION_COLOR,
    strokeWidth: 2,
    createdAt: now,
  };
}

export function createLineConnection(
  fromElementId: string,
  toElementId: string
): IConnection {
  const now = Date.now();

  return {
    id: `line-${now}`,
    type: 'line',
    fromElementId,
    toElementId,
    color: DEFAULT_CONNECTION_COLOR,
    strokeWidth: 2,
    createdAt: now,
  };
}
