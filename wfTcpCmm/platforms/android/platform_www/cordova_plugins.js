cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "spc.cdv.plugin.tcpCmm.tcpCmm",
        "file": "plugins/spc.cdv.plugin.tcpCmm/www/tcpCmm.js",
        "pluginId": "spc.cdv.plugin.tcpCmm",
        "clobbers": [
            "spcPlug.tcpCmm"
        ]
    },
    {
        "id": "spc.cdv.plgin.wf.wifiAp",
        "file": "plugins/spc.cdv.plgin.wf/www/wifiAp.js",
        "pluginId": "spc.cdv.plgin.wf",
        "clobbers": [
            "wifiAp"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "spc.cdv.plugin.tcpCmm": "1",
    "spc.cdv.plgin.wf": "0.0.1"
};
// BOTTOM OF METADATA
});