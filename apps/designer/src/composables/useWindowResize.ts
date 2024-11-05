export function useWindowResize() {
  const callbackList: (() => void)[] = [];

  function onWindowResize(callback: () => void) {
    callbackList.push(callback);
    listenWindowResize(callback);
  }

  onUnmounted(() => {
    callbackList.forEach((callback) => {
      window.removeEventListener('resize', callback);
    });
    callbackList.splice(0, callbackList.length);
  });

  return {
    onWindowResize,
  };
}

function listenWindowResize(callback: () => void) {
  window.addEventListener('resize', callback);
}
