import type { DropBoxSettings } from '@/types/charts';

export abstract class BaseChart<Props> {
  abstract initDropBoxSettings(): Record<string, DropBoxSettings>;

  abstract initProps(): Props;

  abstract validate(): { success: boolean, message: string };

  abstract buildOptions(): Record<string, any>;
}
