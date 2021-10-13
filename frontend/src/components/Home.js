import React from "react-dom";
import "../index.css";
import NavBar from "./NavBar";
import { useState } from "react";
import { uploadFile } from "../helpers/uploadFile";
import excel from "../svg/excel.svg";
import comeon from "../svg/comeon.svg";
import trash from "../svg/trash-delete.svg";
import Footer from "./Footer";
import { deleteData } from "../helpers/deleteData";

const url = process.env.BACK_END_URL || "http://localhost:8000";

function Home() {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState(
        "e.g. Export trading history-2021-11-11.xlsx"
    );
    const [msg, setMsg] = useState();
    const [msg_dlt, setMsg_dlt] = useState();

    function handleChange(e) {
        setFile(e.target.files[0]);
        setFilename(e.target.value.substring(12, e.target.value.length));
    }

    function handleSubmit(e) {
        setMsg("It takes a few seconds, be patient.");
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", file);
        uploadFile(url, formData)
            .then((r) => {
                console.log(r);
                console.log(r.status);
                if (r.status === 201) {
                    setMsg(
                        "You have succesfully upload the file, go see your trades"
                    );
                } else {
                    setMsg("Something went wrong, please try again!");
                }
            })
            .catch((e) => console.log(e));
    }

    function handleClick(e) {
        deleteData(url)
            .then((r) => {
                if (r.status === 204) {
                    setMsg_dlt("Successfully deleted");
                }
            })
            .catch((e) => console.log(e));
    }

    return (
        <div>
            <div className="page-wrap">
                <NavBar />
                <div className="home">
                    <div className="left-home">
                        <div className="tracker-title">XLSXTracker</div>
                        <div class="text-home">
                            Now you only have to{" "}
                            <text>upload the xlsx file</text> and we would do
                            the rest.<p></p> Remember, this only work with your{" "}
                            <text>trading history</text>.
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="form-home-form"
                        >
                            <div className="form-home">
                                <label className="btn-blue" for="file">
                                    Select File
                                </label>
                                <input
                                    id="file"
                                    className="upload-input"
                                    type="file"
                                    onChange={handleChange}
                                ></input>
                                <div class="filename">{filename}</div>
                                <button
                                    className="btn-blue-outline"
                                    type="submit"
                                >
                                    Upload
                                </button>
                            </div>
                            <div className="msg-home">{msg}</div>
                        </form>
                        <div className="text-home">
                            If you have more than one trading file
                            to avoid errors on the algorithm, you need to 
                            <text> combine all the excel files into one</text>, you can <text>do
                            that below </text>, feel free to upload all the files you
                            want, even if you repeat the same twice there is no
                            problem.
                            <p></p>
                            Then if you have already upload one file you <text>must delete all the trades and
                            upload this new trading file</text>. We advise you to save this
                            file and then use it to merge it with new ones
                            downloaded from Binance to repeat all the previous
                            process. 
                        </div>
                        <div className="merge-files">

                        </div>
                        <div className="delete-home">
                            <button
                                className="btn-blue-outline"
                                value="delete-all"
                                onClick={handleClick}
                                type="submit"
                            >
                                <img src={trash} alt="trash can" /> Delete All
                            </button>
                            <text>{msg_dlt}</text>
                        </div>
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
