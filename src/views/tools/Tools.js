import { InputNumber } from "antd";
import { useState } from "react";
export default function ToolsView() {
  const [value, setValue] = useState(0);
  const [two, setTwo] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <InputNumber
        style={{ width: "340px", margin: "20px" }}
        addonBefore="10进制"
        onChange={(e) => {
          setValue(e);
        }}
      ></InputNumber>
      {ten2two(value)}
    </div>
  );
}

function two2ten(num) {
  let res = parseInt(num, 2);
  if (isNaN(res)) {
    return "";
  }
  return res;
}

function ten2two(num) {
  var value = parseInt(num).toString(2);
  console.log(value);
  if (value === "NaN" || value === undefined || value === "0") {
    return "";
  }
  var l = value.length; //获取要格式化数字的长度，如二进制1的话长度为1
  if (l < 64) {
    //补全位数 0000，这里我要显示4位
    for (var i = 0; i < 64 - l; i++) {
      value = "0" + value; //不够的就在前面补0
    }
  }
  let resp = "";
  for (i = 0; i < 64; i++) {
    resp = resp + value[i];
    if ((i + 1) % 4 === 0) {
      resp = resp + " ";
    }
  }
  return resp;
}
