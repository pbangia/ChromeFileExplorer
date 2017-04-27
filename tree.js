//Tree Data
var treeData = [];
var treeID = '#fileTree';
var folderPathway = "";

function setUpTree() {
    refreshTree();

    // bind 'tree.click' event
    //when click on name
    $(treeID).bind(
        'tree.click',
        function (event) {
            // The clicked node is 'event.node'            
            console.log("click node name");
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
        if (node.children.length == 0 || (node.children.length == 1 && node.children[0].name == "*")) {
            //remove the blank placeholder
            removeChildrenFromNode(node);
            getChildrenFolders(node.id);
           // refreshTree();
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
function currentDirectoryToJSONFormat(fileName, link) {
  
    var dirNames = link.split("/"); //TODO change this so that windows and linux can use
    var dirLength = dirNames.length;

    //second to last in dirNames is current directory


    var parentDir = "";
    for (var i = 0; i < dirLength - 2; i++) {
        parentDir += (dirNames[i]+"/");
    }

    var parentNode = $(treeID).tree('getNodeById', parentDir);
    console.log("parent " + parentDir);
    console.log("parent id " + parentNode.id);
    console.log("childDir " + fileName);
    console.log("link id " + link);
    var name = fileName.replace("/", "");

    //add child to parent node
    $(treeID).tree('appendNode',
    {
        name: name,
        id: link, //full path
        children: [{ name: "*" }]
    },
    parentNode
    );

}

function getChildrenFolders(path) {
    console.log("get children folders");
    console.log(constants.urlBase + path + "");
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
                currentDirectoryToJSONFormat(fileName, link);
            }
           
        }
    });
}


//$.ajax({
//    async: false,
//    type: 'GET',
//    url: folderPathway,
//    success: function (data) {
//        //callback
//    }
//});
