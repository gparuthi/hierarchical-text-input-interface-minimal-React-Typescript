import * as React from "react";
import { NodeHolder } from "../store/NodeHolder";
import { Item } from "./Item";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 8;

const getItemStyle = (isDragging:boolean, draggableStyle:any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 1,
    // margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'lightgray',

    // styles we need to apply on draggables
    ...draggableStyle,
});
const getListStyle = (isDraggingOver:boolean) => ({
    // background: isDraggingOver ? 'lightblue' : '#E4EBED',
    // padding: grid,
    // width: 250,
});

export class NodeList extends React.Component<any, any> {
    rootNode: NodeHolder

    constructor(props: any) {
        super(props);
        this.rootNode = new NodeHolder("test2")
        this.rootNode.addNewChild("")
        this.state = { 
            flatlist: this.rootNode.getOrderedFlatNodeList().slice(1),
            currentNode: this.rootNode.children[0],
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentWillMount() {
        // BannerDataStore.addChangeListener(this._onchange);
        // document.addEventListener("click", this._handleDocumentClick, false);
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }
    updateState(){
        this.setState({
            flatlist: this.rootNode.getOrderedFlatNodeList().slice(1)
        })
    }
    _handleKeyDown(e:any) {
        var keyCode = e.keyCode || e.which;
        if (e.shiftKey && keyCode == 9) { // shift-tab key
            // Unindent the current node
            e.preventDefault();
            let currentNode = this.state.currentNode
            // remove from parent and add to parent's parent
            if (currentNode.depth < 2) {
                return
            }
            // get new parent
            var newParent = currentNode.parent.parent
            // get the index at which this node should be added
            let newIndex = newParent.getChildIndex(currentNode.parent) + 1
            // remove from parent
            currentNode.parent.removeChild(currentNode)
            // add node to new index
            newParent.addNodeAtIndex(newIndex, currentNode)
            // modify the depth
            currentNode.depth -= 1
            this.updateState()
        } else if (keyCode == 9) { // tab key
            // Indent the current node
            e.preventDefault();
            let currentNode = this.state.currentNode
            // remove from parent and add to previous
            if (currentNode.depth>3)
                return
            var prevSibling = currentNode.getPrevSibling()
            if (prevSibling) {
                // remove this from parent
                currentNode.parent.removeChild(currentNode)
                // add this node to previous sibling
                prevSibling.addNodeAtIndex(prevSibling.children.length, currentNode)
                // increment the depth
                currentNode.depth += 1
                // update
                this.updateState()
            }
        }
        if (keyCode == 13) { // enter Key
            // Add a new node as a sibling to the current node.
            e.preventDefault();
            // Get currently selected node
            let currentNode = this.state.currentNode
            let newNode = null
            if (currentNode.children.length == 0) {
                // Add the new node as a sibling, i.e. as a child to the parent node at the next index of current node
                newNode = currentNode.parent.addNewChild("", currentNode.parent.getChildIndex(currentNode) + 1)
            } else {
                // Add a new child
                newNode = currentNode.addNewChild("e", 0)
            }
            this.setState({currentNode: newNode})

            this.updateState()
            // newNode.trigger('focus')
        }
        if (keyCode == 38) { // up key
            e.preventDefault();
            this._handleUpKey()
        }
        if (keyCode == 40) { // down key
            e.preventDefault();
            // focus on the next node
            let index = this.state.flatlist.findIndex((n: NodeHolder) => n.tid === this.state.currentNode.tid) + 1
            // cycle to the first one if end is reached
            if (index >= this.state.flatlist.length)
                index = 0
            this.setState({ currentNode: this.state.flatlist[index] })
        }
        if (keyCode == 8) { // backspace when title is ""
            let currentNode = this.state.currentNode
            if (currentNode.title === "") {
                e.preventDefault();
                // focus on the previous node
                this._handleUpKey()
                // delete current node from parent
                currentNode.parent.removeChild(currentNode)
                this.updateState()
            }
        }
    }

    _handleUpKey(){
        // focus on the previous node
        let index = this.state.flatlist.findIndex((n: NodeHolder) => n.tid === this.state.currentNode.tid) - 1
        // cycle to the last one if end is reached
        if (index < 0)
            index = this.state.flatlist.length - 1
        this.setState({ currentNode: this.state.flatlist[index] })
    }

    
    reorder(startIndex:number, endIndex:number){
        const [movedNode] = this.state.flatlist.splice(startIndex, 1);
        const [movedToNode] = this.state.flatlist.splice(endIndex-1, 1);
        movedNode.parent.removeChild(movedNode)
        movedToNode.addNodeAtIndex(0, movedNode)
        console.log("moving from",movedNode.title, movedToNode.title)
        this.updateState()
    }
    onDragEnd(result:any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = this.reorder(
            result.source.index,
            result.destination.index
        );

        this.setState({
            items,
        });
    }

    _buildContext(node:NodeHolder){
        let context = {
            node: this.state.currentNode,
            onclick: (node: NodeHolder) => {
                this.setState({ currentNode: node })
            }
        }
        return context
    }

    render() {
        const list_items = this.state.flatlist.map((child: NodeHolder) => {
            
            return <Item key={"k_" + child.tid} node={child} context={this._buildContext(child)} />
        }) 
        return (
            <div className="container">
                <h1></h1>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {this.state.flatlist.map((item:NodeHolder, index:number) => (
                                    <Draggable key={item.tid} draggableId={item.tid} index={index}>
                                        {(provided, snapshot) => (
                                            <div>
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <Item key={"k_" + item.tid} node={item} context={this._buildContext(item)}  />
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                
                
            </div>
        );
    }
}