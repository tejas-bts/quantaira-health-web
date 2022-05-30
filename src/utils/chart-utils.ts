import { ITimeScaleApi } from 'lightweight-charts';

export const handleZoomOut = (timeScale: ITimeScaleApi) => {
  if (timeScale != undefined) {
    const currentTimeScale = timeScale.getVisibleLogicalRange();
    if (currentTimeScale != null) {
      timeScale.setVisibleLogicalRange({
        from: currentTimeScale.from - 1,
        to: currentTimeScale.to + 1,
      });
    }
  }
};

export const handleZoomIn = (timeScale: ITimeScaleApi) => {
  if (timeScale != undefined) {
    const currentTimeScale = timeScale.getVisibleLogicalRange();
    if (currentTimeScale != null) {
      timeScale.setVisibleLogicalRange({
        from: currentTimeScale.from + 1,
        to: currentTimeScale.to - 1,
      });
    }
  }
};

export const handleScrollRight = (timeScale: ITimeScaleApi) => {
  if (timeScale != undefined) {
    const currentTimeScale = timeScale.getVisibleLogicalRange();
    if (currentTimeScale != null) {
      timeScale.setVisibleLogicalRange({
        from: currentTimeScale.from - 1,
        to: currentTimeScale.to - 1,
      });
    }
  }
};

export const handleScrollLeft = (timeScale: ITimeScaleApi) => {
  if (timeScale != undefined) {
    const currentTimeScale = timeScale.getVisibleLogicalRange();
    if (currentTimeScale != null) {
      timeScale.setVisibleLogicalRange({
        from: currentTimeScale.from + 1,
        to: currentTimeScale.to + 1,
      });
    }
  }
};
