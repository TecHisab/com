import * as THREE from 'three';

/**
 * Probes WebGL2 renderer string cleanly (without touching userAgent) to detect
 * software rasterizers (SwiftShader, llvmpipe, WARP) for rendering-cost pacing.
 */
export function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Checks whether any WebGL context is available at all.
 */
export function isWebGLAvailable(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const ok = Boolean(gl);
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    return ok;
  } catch {
    return false;
  }
}

/**
 * Schedules the next animation callback after WebGL2 GPU/CPU commands complete
 * on software WebGL rasterizers so the main thread is never starved.
 */
export function createAfterDrawScheduler(renderer: THREE.WebGLRenderer) {
  let timeoutId = 0;
  let disposed = false;

  const schedule = (cb: () => void) => {
    if (disposed) return;
    const rawGl = renderer.getContext();
    const gl = rawGl as WebGL2RenderingContext;
    if (typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          timeoutId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timeoutId = window.setTimeout(cb, 80);
        }
      };
      timeoutId = window.setTimeout(poll, 5);
    } else {
      timeoutId = window.setTimeout(cb, 80);
    }
  };

  const cancel = () => {
    disposed = true;
    window.clearTimeout(timeoutId);
  };

  return { schedule, cancel };
}
