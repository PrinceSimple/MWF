/**
 * @author Frank Trojanowski
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";

export default class ReadViewController extends mwf.ViewController {

    constructor() {
        super();
        this.viewProxy = null
    }
    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        var mediaItem = this.args.item//new entities.MediaItem("m","https://placeimg.com/300/400/music")
        this.viewProxy = this.bindElement("mediaReadviewTemplate", {item:mediaItem}, this.root).viewProxy;
        this.viewProxy.bindAction("deleteItem", (() => {
            mediaItem.delete().then(() => {
                this.previousView({deletedItem:mediaItem});
            })
        }))
        // call the superclass once creation is done
        super.oncreate();
    }

    bindDialog(dialogid, dialog, item) {
        // call the supertype function
        super.bindDialog(dialogid, dialog, item);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    /*
     * for views that initiate transitions to other views
     */
    async onReturnFromSubview(subviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

}

