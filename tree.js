//Tree Data
var treeData = [];
var treeID = '#fileTree';
var folderPathway = "";
var treeList = [];

function setUpTree() {
    refreshTree();

    //add first directory
    $(treeID).tree('appendNode',
       {
           name: currentDirectory,//TODO change to currentDirectory name
           id: currentDirectory + "/",//full path
           children: [{ name: "" }]
       }
 );
    var n = $(treeID).tree('getNodeById', currentDirectory + "/");
    console.log("select node for first " + n.id);
    $(treeID).tree('addToSelection', n);
    selectedNode = n;


    // bind 'tree.click' event
    //when click on name
    $(treeID).bind(
        'tree.click',
        function (event) {
            // The clicked node is 'event.node'            
            console.log("click node name");
            selectedNode = event.node;
            loadPage(event.node.id);
        }
    );

    //when click on arrow
    $(treeID).bind(
    'tree.open',
    function (e) {
        var node = e.node;
        console.log("open node " + node.id);
        console.log("length " + node.children.length);
        console.log("child \'" + node.children[0].name +"\'");
        //check if children do not exist (would only have 1 placeholder child whose value is "")
        if (node.children.length == 0 || (node.children.length == 1 && node.children[0].name == "")) {
            //remove the blank placeholder
            removeChildrenFromNode(node);
            getChildrenFolders(node.id);

            //not working as async and run this code before get finishes
            console.log("h");
            for (var i = 0; i < treeList.length; i++) {
                if (!hasChildren(treeList[i])) {
                    var thisNode = $(treeID).tree('getNodeById', treeList[i]);
                    removeChildrenFromNode(thisNode);
                }
            }
        }        
    }
);
}

function refreshTree() {
    $(treeID).tree({
        data: treeData
    });

}

//Remove all children from node
function removeChildrenFromNode(node) {
    console.log("remove child from node " );
    console.log("node name " + node.name);
    console.log("node id " + node.id);

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
    console.log("parent " + path);
    console.log("parent id " + parentNode.id);
    console.log("childDir " + fileName);
    console.log("link id " + link);
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

    treeList = [];

    folderPathway = constants.urlBase + path;
    $.get(folderPathway, function (data) {
        $(".result").html(data);
        var table = document.getElementById("tbody");
        for (var i = 0, row; row = table.rows[i]; i++) {
            var fileName = row.cells[0].dataset.value;
            var link = path  + fileName;

            console.log("filename " + fileName);
            console.log("link " + link);

            if (isDirectory(fileName)) {
                currentDirectoryToJSONFormat(fileName, link, path);
                treeList.push(link);
            }
           
        }
    });

}

function hasChildren(path) {


    console.log("check if have children " + path);

    var hasChild = false;
    var done = false;

    folderPathway = constants.urlBase + path;
    $.get(folderPathway, function (d) {
        $(".result").html(d);
        var table = document.getElementById("tbody");
        for (var i = 0, row; row = table.rows[i]; i++) {
            var fileName = row.cells[0].dataset.value;
            if (isDirectory(fileName)) {
                console.log("have child directory " + fileName);
                hasChild = true;
                break;
            }
        }
        done = true;
    });

    console.log("returning " + hasChild);
   
    return hasChild;
}
