/*
 * NASA Worldview
 *
 * This code was originally developed at NASA/Goddard Space Flight Center for
 * the Earth Science Data and Information System (ESDIS) project.
 *
 * Copyright (C) 2013 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 */

/**
 * @module wv.layers
 */
var wv = wv || {};
wv.layers = wv.layers || {};

/**
 * @class wv.layers.filter
 */
wv.layers.filter = wv.layers.filter || function(models, ui, config) {

    var model = models.layers;
    var self = {};

    //self.selector = '#layer-modal';
    //self.id = 'layer-modal';

    var currentPath = [];

    var depthFirstTraversal = function(o, fn) {
        currentPath.push(o);
        if(o.children) {
            for(var i = 0, len = o.children.length; i < len; i++) {
                depthFirstTraversal(o.children[i], fn);
            }
        }
        fn.call(null, o, currentPath);
        currentPath.pop();
    }

    var shallowCopy = function(o) {
        var result = {};
        for(var k in o) {
            if(o.hasOwnProperty(k)) {
                result[k] = o[k];
            }
        }
        return result;
    }

    var copyNode = function(node) {
        var n = shallowCopy(node);
        if(n.children) { n.children = []; }
        return n;
    }

    var filterTree = function(root, ids) {
        
        root.copied = copyNode(root); // create a copy of root
        var filteredResult = root.copied;
        console.log(root);
        depthFirstTraversal(root, function(node, branch) {
            // if this is a leaf node _and_ we are looking for its ID
            if( !node.children && ids.indexOf(node.id) !== -1 ) {
                // use the path that the depthFirstTraversal hands us that
                // leads to this leaf.  copy any part of this branch that
                // hasn't been copied, at minimum that will be this leaf
                for(var i = 0, len = branch.length; i < len; i++) {
                    if(branch[i].copied) { continue; } // already copied

                    branch[i].copied = copyNode(branch[i]);
                    // now attach the copy to the new 'parellel' tree we are building
                    branch[i-1].copied.children.push(branch[i].copied);
                }
            }
        });

        depthFirstTraversal(root, function(node, branch) {
            delete node.copied; // cleanup the mutation of the original tree
        });

        return filteredResult;
    }

    self.filterTreeList = function(list, ids) {
        //console.log(list);
        var filteredList = [];
        for(var i = 0, len = list.length; i < len; i++) {
            filteredList.push( filterTree(list[i], ids) );
        }
        return filteredList;
    }

    var hierarchy = [ /* your data here */ ];
    var ids = [1,3];

    //var filtered = self.filterTreeList(hierarchy, ids);
    
    //init();
    return self;
};
