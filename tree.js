//Tree Data
var data = [];
treeID = '#fileTree';

/*
 = [

    {
        name: 'node1',
        children: [
            {
                name: 'child1',
                children: [
                { name: 'child3' }
                ]
            },
            { name: 'child2' }
        ]
    },
    {
        name: 'node2',
        children: [""]
    }
];
    {
        name: 'node1',
        children: [
            {
                name: 'child1',
                children: [
                { name: 'child3' }
                ]
            },
            { name: 'child2' }
        ]
    },
    {
        name: 'node2',
        children: [
            { name: 'child3' }
        ]
    }
*/
//call to refresh tree
function refreshTree(){
    $(treeID).tree({
        data: data
        //onCreateLi: function()    //called for each on create node
    });
}

//Set up intial Tree;
$(function () {
    console.log("in here");

    //data.push({
    //    name: "currentDirectory",//TODO change to currentDirectory name
    //    children: [""]
    //});

    refreshTree();   

    $(treeID).tree('appendNode',
        {
            name: "currentDirectory"//TODO change to currentDirectory name
            //id: //full path
        }
        );

});



//takes single DirectoryFile object and name of current directory
function currentDirectoryToJSONFormat(directoryFile, curDirectory) {
    if (typeof directoryFile == DirectoryFile) {
        var dirString = directoryFile.replace("\\", "/");
        var dirNames = dirString.link.split("/"); //TODO change this so that windows and linux can use
        var dirLength = dirNames.length;

        //get the position of the current directory(root) and work from there
        var currentDirPos;
        for(var i=0;i<dirLength;i++){
            if (dirNames[i] == curDirectory) {
                currentDirPos = i;
                break;
            }
        }

        //if just adding to the root directory
        //if if second to last element is the current directory
        if ((dirLength - 2) == i) {
            //var parentNode = $(treeID).tree('getNodeById', );
            //$(treeID).tree('appendNode',
            //   {
            //       name: "currentDirectory"//TODO change to currentDirectory name
            //       //id: //full path
            //   },
            //   parentNode
            //   );
            
        }
        //else need to go through nested data array
        else {

        }

        for (var i = currentDirPos; i < dirLength; i++) {
            //second to last in dirNames is current directory
            var parentDir = dirNames[i];

            //last is child directory name
            var childDir = dirNames[i + 1];

        }
}

function addToTree(item) {
    da
}

function checkDirHasChildren(directoryPath) {

    //if directory in directoryPath has children dir return true


    return false;
}
/*
$scope.addItem = function() {
				$scope.menuItems.push({
					name: 'Test Menu Item',
					children: []
				});
			};

			$scope.addSubItem = function(item) {
				item.children.push({
					name: 'Sub'+(item.children.length+1)
				});
			};
*/

/*
DirectoryFile 
    this.fileName = fileName;
    this.isFolder = isFolder;
    this.link = link;
    this.size = size;
    this.sizeRaw = sizeRaw;
    this.dateModified = dateModified;
    this.dateModifiedRaw = dateModifiedRaw;
*/




//class TreeDataStore{

//    data.




//}
