export async function openDB(dbName, version = 1) {
  return new Promise((resolve, reject) => {
    var indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    let db;
    const request = indexedDB.open(dbName, version);
    request.onsuccess = function (event) {
      db = event.target.result; 
      console.log("数据库打开成功");
      resolve(db);
    };
    request.onerror = function (event) {
      console.log("数据库打开报错");
    };
    request.onupgradeneeded = function (event) {
      console.log("onupgradeneeded");
      db = event.target.result; 
      var objectStore;
      objectStore = db.createObjectStore("books", {
        keyPath: "id", 
      });
      objectStore.createIndex("id", "id", { unique: false });
    };
  });
}

export async function addData(db, storeName, data) {
  var request = db
    .transaction([storeName], "readwrite") 
    .objectStore(storeName) 
    .add(data);

  request.onsuccess = function (event) {
    console.log("数据写入成功");
  };

  request.onerror = function (event) {
    console.log("数据写入失败");
  };
}

export async function getDataByKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName]); 
    var objectStore = transaction.objectStore(storeName); 
    var request = objectStore.get(key); 

    request.onerror = function (event) {
      console.log("事务失败");
    };

    request.onsuccess = function (event) {
      console.log("主键查询结果: ", request.result);
      resolve(request.result);
    };
  });
}

export async function closeDB(db) {
  db.close();
  console.log("数据库已关闭");
}

export function deleteDB(db, storeName, id) {
  var request = db
    .transaction([storeName], "readwrite")
    .objectStore(storeName)
    .delete(id);

  request.onsuccess = function () {
    console.log("数据删除成功");
  };

  request.onerror = function () {
    console.log("数据删除失败");
  };
}

export function updateDB(db, storeName, data) {
  var request = db
    .transaction([storeName], "readwrite") 
    .objectStore(storeName) 
    .put(data);

  request.onsuccess = function () {
    console.log("数据更新成功");
  };

  request.onerror = function () {
    console.log("数据更新失败");
  };
}

export async function cursorGetData(db, storeName) {
  return new Promise((resolve, reject) => {
    let list = [];
    var store = db
      .transaction(storeName, "readwrite") 
      .objectStore(storeName); 
    var request = store.openCursor(); 
    request.onsuccess = function (e) {
      var cursor = e.target.result;
      if (cursor) {
        list.push(cursor.value.id);
        cursor.continue();
      } else {
        console.log("游标读取的数据：", list);
        resolve(list)
      }
    };
  });
}
