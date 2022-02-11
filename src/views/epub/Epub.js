import { Upload, message, Button, List, Affix } from "antd";
import { ImportOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState, useReducer } from "react";
import { ReactReader } from "../../modules";
import {
  openDB,
  getDataByKey,
  updateDB,
  cursorGetData,
  deleteDB,
} from "../../db";
import { Link } from "react-router-dom";
export default function EpubReadView() {
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [files, filesDispatch] = useReducer(filesReducer, []);
  const db = useRef(null);
  useEffect(() => {
    let fetchData = async () => {
      db.current = await openDB("indexdb", 2);
      filesDispatch({
        type: "set",
        id: await cursorGetData(db.current, "books"),
      });
    };
    fetchData();
  }, []);
  const locationChanged = (epubcifi) => {
    console.log(typeof epubcifi);
    updateDB(db.current, "books", {
      id: file.name,
      data: file,
      page: epubcifi,
    });
    setLocation(epubcifi);
  };
  let delItem = (item) => {
    filesDispatch({
      type: "del",
      id: item,
    });
    deleteDB(db.current, "books", item);
  };
  let readItem = async (item) => {
    let epub = await getDataByKey(db.current, "books", item);
    if (epub === undefined) {
      return;
    }
    if (epub.page !== undefined) {
      setLocation(epub.page);
    }
    if (epub.data !== undefined) {
      setFile(epub.data);
    }
  };
  return (
    <div style={{ height: "100vh" }}>
      {file == null && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <List
            dataSource={files}
            renderItem={(item) => (
              <List.Item>
                {item}
                <Button
                  type="default"
                  size="small"
                  onClick={() => delItem(item)}
                  style={{ marginLeft: "10px" }}
                >
                  del
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={() => readItem(item)}
                  style={{ marginLeft: "10px" }}
                >
                  read
                </Button>
              </List.Item>
            )}
          ></List>
          <Upload
            accept="application/epub+zip"
            beforeUpload={(file) => {
              if (file.type !== "application/epub+zip") {
                message.error("Only epub files are allowed");
                return false;
              }
              // setFile(file);
              let data = {
                id: file.name,
                data: file,
                page: location,
              };
              console.log(data);
              updateDB(db.current, "books", data);
              filesDispatch({
                type: "add",
                id: data.id,
              });
              return false;
            }}
          >
            <Button type="default" size="large" icon={<UploadOutlined />}>
              upload epub
            </Button>
          </Upload>
        </div>
      )}
      {file != null && (
        <div style={{height:"100vh"}}>
          <ReactReader
            location={location}
            locationChanged={locationChanged}
            url={file}
          />
          <Affix
            style={{
              position: "absolute",
              top: "90vh",
              left: "95vw",
              zIndex: "999",
            }}
          >
            <Button
              type="default"
              shape="circle"
              size="large"
              onClick={() => {
                setFile(null);
              }}
            >
              <ImportOutlined />
            </Button>
          </Affix>
        </div>
      )}
    </div>
  );
}

function filesReducer(state, action) {
  switch (action.type) {
    case "del":
      return state.filter((item) => item !== action.id);
    case "add":
      return [...state, action.id];
    case "set":
      return action.id;
    default:
      throw new Error();
  }
}
