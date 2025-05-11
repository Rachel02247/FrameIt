/* eslint-disable react-refresh/only-export-components */

import { useState } from "react";
import { Folder } from "../../types";
import axios from "axios";

export default async () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [folders, setFolders] = useState<Folder[]>([]);
    const userId = sessionStorage.getItem("id");
    const res = await axios.get(`${baseUrl}/folders/myFiles/${userId}`);
    setFolders(res.data);
    return(<>
    {folders.map((folder) => (
        <h1 key={folder.id}>{folder.name}</h1>
    ))}
    </>)
}