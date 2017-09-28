'use strict';

var request = require('request-promise');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

class QQGroup {
    constructor() {
        this._options = {
            uri: '',
            baseUrl: 'http://qun.qq.com/cgi-bin/qun_mgr/',
            method: 'POST',
            headers: {
                Cookie: '',
                Host: 'qun.qq.com',
                Origin: 'http://qun.qq.com',
                Referer: 'http://qun.qq.com/member.html'
            },
            form: {
                bkn: ''
            }
        };
        this._groupsList = []
        this._groupMembers = []
    }
    
    _getToken(t) {
        if (t) {
            for (var r=5381,n=0,o=t.length;o>n;++n) r+=(r<<5)+t.charAt(n).charCodeAt();
            return 2147483647&r
        }
    }

    config(cookies) {
        if (!cookies) throw new Error('No cookies input!');
        this._options.headers.Cookie = cookies;
        this._options.form.bkn = this._getToken(cookies.split('skey')[cookies.split('skey').length - 2].split(';')[0].substr(1));
    }

    getGroupsList() {
        var options = this._options;
        var uri = 'get_group_list';
        var self = this;
        options.uri = uri;
        return new Promise(function (resolve, reject) {
            request(options).then(function (body) {
                var info = JSON.parse(body);
                if (info.ec) {
                    var error = new Error('[Remote Error] ' + entities.decode(info.em) + ' (Code:'+ info.ec +')');
                    error.status = 400;
                    reject(error);
                }
                if (!info.ec) {
                    if (info.create && info.manage)
                        self._groupsList = [...info.create, ...info.manage];
                    if (info.create && !info.manage)
                        self._groupsList = [...info.create];
                    if (!info.create && info.manage)
                        self._groupsList = [...info.manage];
                    resolve(self._groupsList);
                }
              }).catch(function (error) {
                reject(error);
            })
        })
    }

    getGroupMembsers (groupId, startAt) {
        if (!groupId) throw new Error('No groupId input!');        
        var options = this._options;
        var st = startAt || 0;
        var uri = 'search_group_members';
        var data = {
            gc: groupId,
            st: st,
            end: st + 200,
            bkn: options.form.bkn
        };
        var self = this;
        options.uri = uri;
        options.form = data;
        return new Promise(function (resolve, reject) {
            request(options).then(function (body) {
                var info = JSON.parse(body);
                if (info.ec) {
                    var error = new Error('[Remote Error] ' + entities.decode(info.em) + ' (Code:'+ info.ec +')');
                    error.status = 400;
                    reject(error);
                }
                if (!info.ec) {
                    for (var index in info.mems) {
                        var member = { uin: info.mems[index].uin, nick: entities.decode(info.mems[index].nick), role: info.mems[index].role }
                        self._groupMembers.push(member);
                    }
                    if (info.mems.length == 201) resolve(self.getGroupMembsers(groupId, data.end + 1));
                    if (self._groupMembers.length === info.count) resolve(self._groupMembers);
                }
              }).catch(function (error) {
                reject(error);
            })    
        })
    }

    deleteGroupMember (groupId, userId) {
        if (!groupId) throw new Error('No groupId input!');        
        if (!userId) throw new Error('No userId input!');        
        var options = this._options;
        var uri = 'delete_group_member';
        var data = {
            gc: groupId,
            ul: userId,
            flag: 0,
            bkn: options.form.bkn
        };
        options.uri = uri;
        options.form = data;
        return new Promise(function (resolve, reject) {
            request(options).then(function (body) {
                var info = JSON.parse(body);
                if (info.ec) {
                    var error = new Error('[Remote Error] ' + entities.decode(info.em) + ' (Code:'+ info.ec +')');
                    error.status = 400;
                    reject(error);
                }
                if (!info.ec) {
                    var all = [];
                    for (var item in info.ul) all.push({uin: info.ul[item], role: 2});
                    resolve(all);
                }
              }).catch(function (error) {
                reject(error);
            })
        })
    }

    deleteGroupMembers (groupId, userArray) {
        var success = [], failed = [];
        var self = this;
        var promiseArray = userArray.reduce(function(item, next) {
            item.push(self.deleteGroupMember(groupId, next.uin))
            return item
        }, [])
        return new Promise(function (resolve, reject) {
            Promise.all(promiseArray).then(function (result) {
                result = result.reduce(
                    function(a, b) {
                      return a.concat(b);
                    }, []);
                resolve(result);
            }).catch(function (error) {
                reject(error);
            })
        })
    }
}

module.exports = QQGroup;
