let MLVObject = {

	objectList : []
	
}


export function updateObjectList(newObjectList){

	if(newObjectList.length > MLVObject.objectList.length){

		newObjectList.map((objectName,index)=>{
			
			if(!(MLVObject.objectList.includes(objectName))){

				MLVObject.objectList.push(objectName)
				MLVObject[objectName] = {
					attributes : []
				}
			}

			console.log(MLVObject)
		})
	}
	if(MLVObject.objectList.length > newObjectList.length){

		MLVObject.objectList.map((objectName,index)=>{

			if(!(newObjectList.includes(objectName))){

				MLVObject.objectList.splice(index,1)

				delete MLVObject[objectName]
			}
			console.log(MLVObject)
		})

	}
	console.log(`after ${MLVObject.objectList}`)

}