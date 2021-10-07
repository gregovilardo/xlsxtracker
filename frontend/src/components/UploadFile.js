import { useState } from "react";
import { uploadFile } from "../helpers/uploadFile";

export default function UploadFile(props) {
    const [file, setFile] = useState(null);

    function handleChange(e) {
        setFile(e.target.files[0]);
        console.log(e.target.files[0]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", file);
        uploadFile(props.url, formData)
        .then(r => console.log(r))
        .catch(e=>console.log(e))
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange}></input>
            <button type="submit">Subir</button>
        </form>
    );
}
