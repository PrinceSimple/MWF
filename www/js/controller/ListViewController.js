/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";

export default class ListViewController extends mwf.ViewController {

    constructor() {
        super()
        console.log("ListViewController()")
        this.items = [
            new entities.MediaItem("m1","https://placeimg.com/100/100/city"),
            new entities.MediaItem("m2","https://placeimg.com/100/100/music"),
            new entities.MediaItem("m3","https://placeimg.com/100/100/culture")
        ]
        this.addNewMediaItem = null
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem")
        this.addNewMediaItemElement.onclick = (() => {
            this.addToListview(new entities.MediaItem("m_new", "https://placeimg.com/100/100/city"))
        })
        this.initialiseListview(this.items)
        super.oncreate();
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    bindListItemView(viewid, itemview, item) {
        // TODO: implement how attributes of item shall be displayed in itemview
        itemview.root.getElementsByTagName("img")[0].src = item.src
        itemview.root.getElementsByTagName("h2")[0].textContent = item.title
        itemview.root.getElementsByTagName("h3")[0].textContent = item.added
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(listitem, listview) {
        // TODO: implement how selection of listitem shall be handled
        console.warn("Element " + listitem.title + " wurde ausgewählt!")
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(option, listitem, listview) {
        // TODO: implement how selection of option for listitem shall be handled
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
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

