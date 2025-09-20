export default function (watch) {
  return async function (...args) {
    try {
      const date = new Date();
      const offset = date.getTimezoneOffset() / -60;

      let [resource, config] = args;

      const cfg = {
        headers: {
          TimeZoneOffset: offset,
          ...(!!localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
          ...config?.headers,
        },
      };

      const { headers, ...other } = config ?? {};

      if (other && typeof other === "object") {
        Object.assign(cfg, other);
      }

      let response = await watch(resource, cfg);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
        }
        throw response;
      }

      return response;
    } catch (err) {
      console.error("Interceptor error:", err);
      throw err;
    }
  };
}
