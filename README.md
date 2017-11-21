# jsforcelayout3

JSForceLayout3 is a JavaScript Force-Directed Layout algorithm that is independent of any other library. The library itself does all the heavy lifting without no visualisation. This makes it easy to integrate with any custom visuals such as three.js.

To use this library, include it in your html:


<script type="text/javascript" src="js/jsforcelayout3.js"></script>


## Example of usage:

```
<script>
  var layout = new JSForceLayout3();

  // add nodes (entity)
  layout.addNode("node1","Hobbies");
  layout.addNode("node2","Cycling");
  layout.addNode("node3","Reading");
  layout.addNode("node4","Comedy");
  layout.addNode("node5","Exercise");
  layout.addNode("node6","Jogging");
  
  // add edges (links between nodes)
  layout.addEdge("node1","node3",1); // link Hobbies to Reading
  layout.addEdge("node1","node5",1); // link Hobbies to Exercise
  layout.addEdge("node3","node4",1); // link Reading to Comedy
  layout.addEdge("node5","node2",1); // link Exercise to Cycling
  layout.addEdge("node5","node6",1); // link Exercise to Jogging
  
  layout.startRender(layoutRender);
  
  function layoutRender() {
  
      var NODES = layout.getNodes();
      for (var key in NODES) {
        var node = NODES[key];
        
        // update node position
        // node.x;
        // node.y;
        // node.z;
      }
  }
  </script>
  ```

bl.ocks.org example at https://bl.ocks.org/kenshinee/673946496acea643df549f91bfb680e7
