import { QueryCtrl } from 'app/plugins/sdk';

export default class GenericQueryCtrl extends QueryCtrl {
    constructor($scope, $injector) {
        super($scope, $injector);

        // 获取参数列表请求
        this.requestParams().then(response => {
            const targets = response.data.target;
            this.options = response.data.options;
            this.text = response.data.text;
            this.keys = Object.keys(targets);

            for (let key in targets) {
                this.target[key] = this.target[key] || targets[key];

            }
        });
    }
    requestParams() {  // 请求获取参数列表
        const params = {
            header: {
                'Content-Type': 'application/json'
            },
            method: 'GET',
            retry: 0,
            url: this.datasource.url + '/param-list'
        };
        return this.datasource.backendSrv.datasourceRequest(params);  // 使用grafana提供的http请求函数
    }
    onChangeInternal() {  // 刷新面板
        this.panelCtrl.refresh(); // grafana自带方法使面板更新数据
    }

    toggleEditorMode() {  // 是否开启编辑模式
        this.target.rawQuery = !this.target.rawQuery;
    }
}

GenericQueryCtrl.templateUrl = './page/query.html';