import * as moment from 'moment';

class NodeElement {
    title: string
    nid: number
    constructor(title: string) {
        this.nid = moment().valueOf()
        this.title = title
    }
}

export class NodeHolder {
    node: NodeElement
    children: Array<NodeHolder>
    parent: NodeHolder
    tid: number
    depth: number

    constructor(title = "", children?: Array<NodeHolder>, parent?: NodeHolder) {
        this.node = new NodeElement(title)
        this.tid = moment().valueOf()
        this.children = children || [];
        this.parent = parent || null
        this.depth = 0
    }

    get title() {
        return this.node.title
    }
    set title(title: string) {
        this.node.title = title
    }

    addNewChild(title="", index=0): NodeHolder {
        var node = new NodeHolder(title)
        return this.addNodeAtIndex(index, node)
    }

    // add existing node at an index
    addNodeAtIndex(index: number, node: NodeHolder): NodeHolder {
        node.parent = this
        this.children.splice(index, 0, node)
        return node
    }

    // remove node from children
    removeChild(child: NodeHolder) {
        this.children = this.children.filter(el => { return el.tid != child.tid });
    }

    // get previous sibling
    getPrevSibling(): NodeHolder {
        if (this.parent) {
            let index = this.parent.children.findIndex(child => child.tid === this.tid)
            index -= 1
            return this.parent.children[index]
        } else {
            return this
        }
    }

    // get next sibling
    getNextSibling(): NodeHolder {
        if (this.parent) {
            let index = this.parent.children.findIndex(child => child.tid === this.tid)
            index += 1
            return this.parent.children[index]
        }
        return this
    }

    // get index of a child node
    getChildIndex(node:NodeHolder): number {
        return this.children.findIndex(child => child.tid === node.tid)
    }

    /**
     * recursive function to create a flat list of nodes 
     * each node is added with a property- depth
     * @param int depth         title of the node
     * @returns Array           list of nodes via a depth first traversal
    */
    getOrderedFlatNodeList(depth=0): Array<NodeHolder> {
        this.depth = depth
        var ret = []
        var i = 0
        for (i = 0; i < this.children.length; i++) {
            let childlist = this.children[i].getOrderedFlatNodeList(depth + 1)
            ret = [...ret, ...childlist]
        }
        return [this, ...ret]
    }
}
