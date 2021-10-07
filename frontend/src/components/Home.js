import React from "react-dom";
import "../index.css";
import NavBar from "./NavBar";
import { useState } from "react";
import { uploadFile } from "../helpers/uploadFile";
import excel from "../svg/excel.svg";
import comeon from "../svg/comeon.svg";
import Footer from "./Footer";

const url = process.env.BACK_END_URL || "http://localhost:8000";

function Home() {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("e.g. Export trading history-2021-11-11.xlsx")

    function handleChange(e) {
        setFile(e.target.files[0]);
        setFilename(e.target.value.substring(12, e.target.value.length));
    }

    function handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", file);
        uploadFile(url, formData)
            .then((r) => console.log(r))
            .catch((e) => console.log(e));
    }

    return (
        <div>
            <div className="page-wrap">
                <NavBar />
                <div className="home">
                    <div className="left-home">
                        <div className="tracker-title">XLSXTracker</div>
                        <div class="text-home">Now you only have to <text>upload the xlsx file</text> and we would do the rest.<p></p> Remember, this only work with your <text>trading history</text>.</div>
                        <form onSubmit={handleSubmit}>

                            <div className="form-home">
                                <label className="btn-blue"for="file">
                                    Select File
                                </label>
                                <input id="file" className="upload-input" type="file" onChange={handleChange}></input>
                                <div class="filename">{filename}</div>
                                <button className="btn-blue-outline" type="submit">Upload</button>
                            </div>
                        </form>
                        <div className="text-home">We quite don't manage the upload of files in separate, so if you have done this 
                        and you see any kind of error feel free to delete what you need and reupload</div>
                    </div>
                    <div className="right-home">
                        <div className="decoration">
                            <div className="circle">
                                <div className="comeon-home">
                                    <img src={comeon} alt="effect" />
                                </div>
                                <div class="excel-logo">
                                    <img src={excel} alt="excel logo" />
                                </div>
                                <div className="circle-effect"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
