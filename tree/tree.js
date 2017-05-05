//Tree Data
var treeData = [];
var treeID = '#fileTree';
var folderPathway = "";
var rootFolder;

//inital set up of tree
function setUpTree() {
    setDataToTree();
    addRootDirectory();
    treeClick();
    treeArrowClick();
}

//set data that tree will display
function setDataToTree() {
    $(treeID).tree({
        data: treeData
    });

}

//add the root directory to tree
function addRootDirectory() {

    //add first directory
    $(treeID).tree('appendNode',
       {
           name: rootFolder,
           id: rootFolder,//full path
           children: [{ name: "" }]
       }
 );
    //var n = $(treeID).tree('getNodeById', currentDirectory);
    ////console.log("select node for first " + n.id);
    //$(treeID).tree('addToSelection', n);
    //selectedNode = n;

}

//when click on node name on tree
function treeClick() {
    $(treeID).bind(
        'tree.click',
        function (event) {
            // The clicked node is 'event.node'   
            selectedNode = event.node;

            //check if children do not exist (would only have 1 placeholder child whose value is "")
            if ((selectedNode.children.length == 1 && selectedNode.children[0].name == "")) {
                //remove the blank placeholder
                removeChildrenFromNode(selectedNode);
                getChildrenFolders(selectedNode.id);
            }
            loadPage(selectedNode.id);
        }
    );
}

//when click on arrow in tree
function treeArrowClick() {
    $(treeID).bind(
        'tree.open',
        function (e) {
            var node = e.node;
            //check if children do not exist (would only have 1 placeholder child whose value is "")
            if (node.children.length == 0 || (node.children.length == 1 && node.children[0].name == "")) {
                //remove the blank placeholder
                removeChildrenFromNode(node);
                getChildrenFolders(node.id);
            }
        }
    );
}

//Remove all children from node
function removeChildrenFromNode(node) {
    $(treeID).tree(
        'updateNode',
        node,
        {
            name: node.name,
            id: node.id,
            children: []
        }
    );
}

//takes single DirectoryFile object and name of current directory
function currentDirectoryToJSONFormat(fileName, link, path) {

    var dirNames = link.split("/"); //TODO change this so that windows and linux can use
    var dirLength = dirNames.length;

    var parentNode = $(treeID).tree('getNodeById', path);
    var name = fileName.replace("/", "");


    //add child to parent node
    $(treeID).tree('appendNode',
    {
        name: name,
        id: link, //full path
        children: [{ name: "" }]
    },
    parentNode
    );

}

function getChildrenFolders(path) {

    folderPathway = constants.urlBase + path;
    $.get(folderPathway, function (data) {
        $(".result").html(data);
        var table = document.getElementById("tbody");
        for (var i = 0, row; row = table.rows[i]; i++) {
            var fileName = row.cells[0].dataset.value;
            var link = path + fileName;

            if (isDirectory(fileName)) {
                currentDirectoryToJSONFormat(fileName, link, path);
            }

        }
    });

}