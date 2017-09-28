# QQ Group Mamage

QQ 群管理 nodejs 版，支持 promise。  
Manage QQ group (also called QQ qun) via nodejs. With promise supported.

## 用法 / Useage

1. 引入包 :

  ```javascript
  var Group = require('qq-group-mamage');
  ```

2. 实例及参数注入 :

  ```javascript
  var group = new Group;
  group.config(cookie);
  ```

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
