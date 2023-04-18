import FormData from "form-data";
import Axios from "axios";
import { useState } from "react";
function App() {
  const [file, setFile] = useState([]);
  console.log("file >>>>>>>>>>>>>>>>>", file);
  const upload = (e) => {
    e.preventDefault();
    let formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("files", file[i]);
    }
    Axios.post("http://localhost:3991/api/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpZCI6IjY0MmU1YzU2ZWM0MmMzYzgyMWM3MmQ1MSIsImlhdCI6MTY4MTM3MDc1MiwiZXhwIjoxNjgxODAyNzUyfQ.k9IC3Zn3YsF_KUYqopuUJ1t5yiL5XIsHEtjCZj7mQnU",
      },
    }).then((res) => {
      console.log("Success ", res);
    });
  };
  return (
    <div className="App">
      <input
        type="file"
        name="screenshot"
        multiple
        onChange={(e) => {
          setFile(e.target.files);
        }}
      />
      <button onClick={(e) => upload(e)}>Submit</button>
    </div>
  );
}

export default App;
