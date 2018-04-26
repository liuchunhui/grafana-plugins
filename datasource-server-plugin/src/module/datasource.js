export default class GenericDatasource {
    constructor(instanceSettings, $q, backendSrv, templateSrv) {
        this.type = instanceSettings.type;  // 组件类型为datasource
        this.url = instanceSettings.url;  // 数据源转换为grafana的代理链接，eg：/api/datasources/proxy/5
        this.name = instanceSettings.name;  // 配置该数据源的名称
        this.backendSrv = backendSrv;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = {
            'Content-Type': 'application/json'
        };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }
    }

    query(options) {   // 查询数据源函数

        const params = {  // 封装http请求参数
            from: options.range.from.format('x'),
            to: options.range.to.format('x'),
            targets: options.queries,
        };

        return this.doRequest({  // 发起http请求并返回结果
            url: this.url + '/card-data',  // 要制定公共接口规范
            method: 'POST',
            data: params
        });
    }

    testDatasource() {  // 测试数据源是否正常工作函数
        return this.doRequest({
            url: this.url + '/',
            method: 'GET',
        }).then(response => {
            if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
            }
        });
    }

    annotationQuery(options) {  // 注释查询
        console.log('annotationQuery options:', options);
    }

    metricFindQuery(options) {
        console.log('metricFindQuery options:', options);
    }

    doRequest(options) {  // 接口请求函数
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return this.backendSrv.datasourceRequest(options);  // datasourceRequest()是grafana提供的请求datasource函数
    }
}