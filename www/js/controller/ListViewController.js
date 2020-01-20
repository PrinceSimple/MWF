/**
 * @author Frank Trojanowski
 */
import { mwf } from "../Main.js"
import { entities } from "../Main.js"
//import { GenericCRUDImplLocal } from "../Main.js"

export default class ListViewController extends mwf.ViewController {

    constructor() {
        super()
        this.resetDatabaseElement = null
        this.addNewMediaItem = null

    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem")
        this.addNewMediaItemElement.onclick = (() => {
            /* this.crudops.create(new entities.MediaItem("m", "https://placeimg.com/100/100/city"))
                .then((created) => {
                    this.addToListview(created)
                }
            ) */
            //this.createNewItem()
            this.nextView("mediaEditView", {item: new entities.MediaItem()})
        })
        this.resetDatabaseElement = this.root.querySelector("#resetDatabase")
        // CRUD
        /* this.crudops.readAll().then((items) => {
            this.initialiseListview(this.items)
        }) */
        this.resetDatabaseElement.onclick = (() => {
            if (confirm("Soll die Datenbank wirklich zurückgesetzt werden?")) {
                indexedDB.deleteDatabase("mwftutdb")
            }
        })
        this.root.querySelector("#refresh-btn").onclick = (() => {
            this.application.switchCRUD(this.application.currentCRUDScope == 'remote' ? 'local' : 'remote')
            this.root.querySelector("#CRUDscope").innerHTML = this.application.currentCRUDScope
            entities.MediaItem.readAll().then((items) => {
                this.initialiseListview(items)
            })
        })
        this.root.querySelector("#CRUDscope").innerHTML = this.application.currentCRUDScope
        entities.MediaItem.readAll().then((items) => {
            this.initialiseListview(items)
        })
        
        super.oncreate()
    }
    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    /* bindListItemView(viewid, itemview, item) {
        // TODO: implement how attributes of item shall be displayed in itemview
        itemview.root.getElementsByTagName("img")[0].src = item.src
        itemview.root.getElementsByTagName("h2")[0].textContent = item.title+item._id
        itemview.root.getElementsByTagName("h3")[0].textContent = item.added
    }
 */
    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
     /*onListItemSelected(listitem, listview) {
        // TODO: implement how selection of listitem shall be handled
        this.nextView("mediaReadView", {item: listitem})
    }*/
  
    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(option, listitem, listview) {
        // TODO: implement how selection of option for listitem shall be handled
        super.onListItemMenuItemSelected(option, listitem, listview)
    }

    bindDialog(dialogid, dialog, item) {
        // call the supertype function
        super.bindDialog(dialogid, dialog, item)

        // TODO: implement action bindings for dialog, accessing dialog.root
    }
    async onReturnFromSubview(subviewid, returnValue, returnStatus) {
        if (subviewid == "mediaReadView" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id)
        }
        if (subviewid == "mediaReadView" && returnValue && returnValue.updatedItem) {
            this.updateInListview(returnValue.updatedItem._id, returnValue.updatedItem)
        }
        if (subviewid == "mediaEditView" && returnValue && returnValue.createdItem) {
            this.addToListview(returnValue.createdItem)
        }
    }
    createNewItem() {
        let newItem = new entities.MediaItem("", "https://placeimg.com/"+ (Math.floor(Math.random() * (400 - 100) ) + 100) + "/" + (Math.floor(Math.random() * (200 - 100) ) + 100) + "/any")
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault()
                    newItem.create().then(() => {
                        this.addToListview(newItem)
                    })
                this.hideDialog();
                })
            }
        })
    }
    confirmDeletion(item){
        this.showDialog("mediaItemConfirmDialog", {
            item: item,
            actionBindings: {
                cancelInteraction: ((event) => {
                    this.hideDialog()
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item)
                    this.hideDialog()
                })
            }
        })
    }
    deleteItem(item) {
        item.delete().then(() => {
            this.removeFromListview(item._id)
        })
    }
    editItem(item) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        this.updateInListview(item._id, item)
                    })
                    this.hideDialog()
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item)
                    this.hideDialog()
                })
            }
        })
    }
    editFRM(item) {
        this.nextView("mediaEditView", {item: item})
    }
}

