//Tree Data
var data = [];

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

//Set up intial Tree;
$(function () {
    console.log("in here");

    data.push({
        name: "this",//currentDirectory
        children: [""]
    });

    refreshTree();   
});

//call to refresh tree
function refreshTree(){
    $('#fileTree').tree({
        data: data
    });
}

//takes single DirectoryFile object and name of current directory
function currentDirectoryToJSONFormat(directoryFile, curDirectory) {
    if (typeof directoryFile == DirectoryFile) {
        var dirString = directoryFile.replace("\\", "/");
        var dirNames = dirString.link.split("/"); //TODO change this so that windows and linux can use
        var dirLength = dirNames.length;

        var currentDirPos;
        for(var i=0;i<dirLength;i++){
            if (dirNames[i] == curDirectory) {
                currentDirPos = i;
                data.push({
                    name: curDirectory,
                    children: []
                });
                break;
            }
        }

        //if just adding 
        if ((dirLength - 2) == i) {

        }
        else {

        }

        for (var i = currentDirPos; i < dirLength; i++) {
            //second to last in dirNames is current directory
            var parentDir = dirNames[i];

            //last is child directory name
            var childDir = dirNames[i + 1];

        }

    }
}

function addToTree(item) {
    da
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
