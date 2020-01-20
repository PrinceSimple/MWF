/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";

export default class MediaEditViewController extends mwf.ViewController {

    constructor() {
        super();
        this.viewProxy = null
    }

    async oncreate() {
        let mediaItem = this.args.item.created ?  this.args.item : new entities.MediaItem()
        this.viewProxy = this.bindElement("mediaEditViewTemplate", {item: mediaItem, crud: this.application.currentCRUDScope}, this.root).viewProxy
        this.viewProxy.bindAction("deleteItem", (() => {
            mediaItem.delete().then(() => {
                this.previousView({deletedItem:mediaItem});
            }).then(() => {
                this.previousView({deletedItem:mediaItem})
            })
        }))
       
        this.form = this.root.querySelector("#mediaEditForm")
        this.preview = this.root.querySelector("main img,main video")
        this.form.src.onblur = () => {
            this.preview.src = this.form.src.value
        }
        console.warn(mediaItem.mediaType)
        this.form.upload.onchange = () => {    
            const fileurl = URL.createObjectURL(this.form.upload.files[0])
            this.form.src.value = fileurl
            mediaItem.src= fileurl
            mediaItem.contentType = this.form.upload.files[0].type
            this.viewProxy.update({item: mediaItem})
            this.preview = this.root.querySelector("main img,main video")
            this.preview.src = fileurl
        }
        
        this.form.onsubmit = () => {
            if (this.form.upload.files[0]){
                const formdata = new FormData()
                formdata.append("UploadData", this.form.upload.files[0])
                const xhr = new XMLHttpRequest()
                xhr.open("POST", "api/upload")
                xhr.onreadystatechange = () => {
                    if(xhr.readyState == 4 && xhr.status == 200){
                        const jsonData = JSON.parse(xhr.responseText)
                        const uploadedContentUrl = jsonData.data.UploadData
                        mediaItem.src = uploadedContentUrl
                        this.saveMediaItem(mediaItem)
                    }
                }
                xhr.send(formdata)
            } else {
                this.saveMediaItem(mediaItem)
            }
            return false
        }
        super.oncreate();
    }
    
    saveMediaItem(mediaItem) {
        if (mediaItem.created){
            mediaItem.update().then(() => {
                this.previousView({updatedItem: mediaItem})
            })
        } else {
            mediaItem.create().then(() => {
                this.previousView({createdItem: mediaItem})
            })
        }
    }


    async onReturnFromSubview(subviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

}

