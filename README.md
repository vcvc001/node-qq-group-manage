# QQ Group Mamage

QQ 群管理 nodejs 版，支持 promise。  
Manage QQ group (also called QQ qun) via nodejs. With promise supported.

## UPDATE

20170929 修复上一版无法使用的错误，增加依赖包。

## 用法 / Useage

返回的 error 有两种，一种是来自 QQ 服务器的错误，有前缀 ```[Remote Error]```，其他的为程序运行时的错误。  
建议从 qun.qq.com 或者 qq.com 中获取 cookies，需要获取来自 qq.com 域下的 cookies，而不是子域名下的 cookies。

1. 引入包 :

  ```javascript
  var Group = require('qq-group-mamage');
  ```

2. 实例及参数注入 :

  ```javascript
  var group = new Group;
  group.config(cookies);
  ```
  cookies 为从 qq.com 获取到的 cookies 数据

3. 内置方法 :

  ```javascript
  # 获取可管理的群列表
  group.getGroupsList().then(function (groups) {
    // some codes
  }).catch(function (error) {
    // some codes
  });

  # 获取制定群的成员信息
  group.getGroupMembsers(groupId).then(function (members) {
    // some codes
  }).catch(function (error) {
    // some codes
  });

  # 删除群成员
  group.deleteGroupMember(groupId, singleId).then(function (members) {
    // some codes
  }).catch(function (error) {
    // some codes
  });

  # 批量删除群成员
  group.deleteGroupMembers(groupId, massIdsArray).then(function (members) {
    // some codes
  }).catch(function (error) {
    // some codes
  });

  ```

## 作者 / Author

- [powacug](https://github.com/powacug)

## License

MIT
