const {drive} = require("../configs/googleAuth");

const getImagesFromSku = async (sku, limit) => {
    const response = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${sku}'`
    });
    const folderId = response.data.files ? response.data.files[0].id : null;
    if (!folderId) throw new Error("FolderId not found");
    return await drive.files.list({
        q: `'${folderId}' in parents`,
        pageSize: limit
    });
}
module.exports = {
    getImagesFromSku
}
