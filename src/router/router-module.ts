const commonRouter = import.meta.globEager("./common/*.ts");
import { throwError } from "@/utils/utils";
import type { RouteRecordRaw } from "vue-router";

type ModuleRouters = Record<string, { [x: string]: Array<RouteRecordRaw> }>;

type RouteRecordRawList = Array<RouteRecordRaw>;

export function routerModuleList(): RouteRecordRawList {
  const _getRouterModule = (moduleRouters: ModuleRouters) => {
    return Object.keys(moduleRouters).reduce(
      (r: RouteRecordRawList, cur: string) => {
        const moduleRouter = moduleRouters[cur].default;
        moduleRouter && r.push(...moduleRouter);
        if (!moduleRouter) {
          throwError(`${cur}路由配置错误`);
        }
        return r;
      },
      []
    );
  };
  return _getRouterModule({
    ...commonRouter,
  });
}
