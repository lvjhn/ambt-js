/** 
 * Ball Tree Node Class 
 */
export class BTNode 
{   
    getCentroidId() {
        return this.centroidId
    }

    getCentroid() {
        const centroidId = this.getCentroidId()
        const centroid = this.tree.centroids.get(centroidId) 
        return centroid
    }

    getRadius() {
        return this.radius 
    }
}

/** 
 * Ball Tree Internal Node Class 
 */
export class BTInternalNode extends BTNode
{
    constructor({ tree, centroidId, radius, children }) {
        super()
        this.tree = tree 
        this.centroidId = centroidId 
        this.radius = radius 
        this.children = children
    }
}

/** 
 * Ball Tree Leaf Node Class (Single)
 */
export class BTLeafNodeSingle extends BTNode
{
    constructor({ tree, pointId }) {
        super()
        this.tree = tree 
        this.pointId = pointId
    }

    getCentroidId() {
        return this.pointId
    }

    getCentroid() {
        const centroidId = this.getCentroidId()
        const centroid = this.tree.points.get(centroidId)
        return centroid 
    }

    getRadius() {
        return 0
    }

    getPoints() {
        return [this.tree.points.get(this.getCentroidId())]
    }
}

/** 
 * Ball Tree Leaf Node Class (Multiple)
 */
export class BTLeafNodeMultiple extends BTNode
{
    constructor({ tree, pointIds, centroidId, radius }) {
        super()
        this.tree = tree 
        this.pointIds = pointIds 
        this.centroidId = centroidId
        this.radius = radius 
    }   

    getPoints() {
        return this.pointsIds.map(pointId => this.tree.points[pointId])
    }
}