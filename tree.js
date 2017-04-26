//Tree Data
var treeData = [];
var treeID = '#fileTree';

function setUpTree() {
    console.log("in here");

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
        console.log("open node");
        getChildrenFolders(e.node.id);
    }
);
}

function refreshTree() {
    $(treeID).tree({
        data: treeData
    });

}

//takes single DirectoryFile object and name of current directory
function currentDirectoryToJSONFormat(fileName, isFolder, link, size, sizeRaw, dateModified, dateModifiedRaw) {
    
    var directoryFile = new DirectoryFile(fileName, isFolder, link, size, sizeRaw, dateModified, dateModifiedRaw);

    var dirNames = directoryFile.link.split("/"); //TODO change this so that windows and linux can use
    var dirLength = dirNames.length;

    //second to last in dirNames is current directory
    var parentDir = dirNames[(dirLength - 2)];
    var parentNode = $(treeID).tree('getNodeById', parentDir);

    //last is child directory name
    var childDir = dirNames[(dirLength - 1)];

    console.log("childDir " + childDir);

    //add child to parent node
    $(treeID).tree('appendNode',
    {
        name: childDir,
        id: link, //full path
        children: [""]
    },
    parentNode
    );

}

function getChildrenFolders(path) {

    $.get(constants.urlBase + path, function (data) {

        var table = document.getElementById("tbody");
        for (var i = 0, row; row = table.rows[i]; i++) {
            var fileName = row.cells[0].dataset.value;
            var isFolder = false;
            var link = currentDirectory + fileName;
            var size = row.cells[1].innerHTML;
            var sizeRaw = row.cells[1].dataset.value;
            var dateModified = row.cells[2].innerHTML;
            var dateModifiedRaw = row.cells[2].dataset.value;

            if (isDirectory(fileName)) {
                currentDirectoryToJSONFormat(fileName, isFolder, link, size, sizeRaw, dateModified, dateModifiedRaw);
            }
           
        }
    });
}

