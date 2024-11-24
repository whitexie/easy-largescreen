import { describe, expect, it } from 'vitest';
import { getRectRangeWidgets } from '../useSelectWidgets';
import { useWidgets } from '../useWidgets';
import '@/materials/index';

describe('getRectRangeWidgets', () => {
  it('组件在框选范围内', () => {
    const { widgets, addWidgetById } = useWidgets();

    const widget = addWidgetById('text', { id: '1', location: { x: 0, y: 0 }, size: { width: 100, height: 100 } });

    const rect = { x: 0, y: 0, width: 100, height: 100 };
    const { rect: rectResult, selectedWidgets } = getRectRangeWidgets(rect, widgets);

    expect(rectResult).toEqual(rect);
    expect(selectedWidgets).toEqual([widget]);
  });

  it('组件部分在框选范围内，框选中组件', () => {
    const { widgets, addWidgetById } = useWidgets();
    const size = { width: 50, height: 50 };

    const widget1 = addWidgetById('text', { id: '1', location: { x: 10, y: 10 }, size });
    const widget2 = addWidgetById('text', { id: '2', location: { x: 70, y: 70 }, size });

    const rect = { x: 20, y: 20, width: 50, height: 50 };
    const { rect: rectResult, selectedWidgets } = getRectRangeWidgets(rect, widgets);

    expect(rectResult).toEqual({ x: 10, y: 10, width: 110, height: 110 });
    expect(selectedWidgets).toEqual([widget1, widget2]);
  });

  it('组件在框选范围外', () => {
    const { widgets, addWidgetById } = useWidgets();
    [
      { location: { x: 685, y: 17 }, size: { width: 200, height: 63 } },
      { location: { x: 199, y: 274 }, size: { width: 324, height: 216 } },
    ].map(({ location, size }, id) => addWidgetById('text', { id: `${id}`, location, size }));

    const rect = { width: 429, height: 202, x: 141, y: 42 };
    const { selectedWidgets } = getRectRangeWidgets(rect, widgets);

    expect(selectedWidgets).toHaveLength(0);
  });
});
