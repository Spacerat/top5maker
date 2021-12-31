export type Graph = Record<string, string[]>;

/**
 * Check whether a node is a descendent of another node
 * @param graph The graph to check
 * @param query.parent The node to check from
 * @param query.target The node to look for
 * @returns True if 'target' is a descendent of 'parent
 */
export function isDescendant(
  graph: Graph,
  query: { parent: string; target: string }
): boolean {
  const { parent, target } = query;
  const children = graph[parent] ?? [];

  return (
    children.includes(target) ||
    children.some((child) => isDescendant(graph, { parent: child, target }))
  );
}

/** Count the number of nodes that each node is a child of */
function inDegrees(graph: Graph) {
  const degrees: Record<string, number> = {};
  Object.values(graph).forEach((children) => {
    for (let child of children ?? []) {
      degrees[child] = degrees[child] === undefined ? 1 : degrees[child] + 1;
    }
  });
  return degrees;
}

function edgeCount(graph: Graph) {
  return Object.values(graph).reduce((prev, c) => prev + c.length, 0);
}

const shallowCopy = (graph: Graph) => Object.fromEntries(Object.entries(graph));

/**
 * Create a copy of a graph with a new edge
 *
 * @param graph The graph to return an update of
 * @param edge The new edge to add
 * @param edge.parent The parent to start the edge at
 * @param edge.child The child to end the edge at
 * @returns A new graph with the new edge
 */
export function withEdge(
  graph: Graph,
  edge: { parent: string; child: string }
) {
  const { parent, child } = edge;
  const children = graph[parent] ?? [];
  if (children.includes(child)) return graph;
  const newGraph = shallowCopy(graph);
  newGraph[parent] = [...children, child];
  return newGraph;
}

/** Return all nodes which descend from 'root' */
function dfs(graph: Graph, root: string): string[] {
  const children = graph[root] ?? [];
  return children.flatMap((child) => [child, ...dfs(graph, child)]);
}

/** Remove all 'items' in 'set' */
function subtract<T>(set: Set<T>, items: Iterable<T>) {
  for (let item of items) {
    set.delete(item);
  }
}

/**
 * Compute the Transitive Reduction of a graph
 *
 * (e.g. if a -> b -> c and a -> c, then a->c is redundant and therefore removed)
 *
 * @param graph The graph to reduce
 * @returns A reduced copy of the graph
 */
export function transitiveReduction(graph: Graph) {
  // Translated from NetworkX
  // https://github.com/networkx/networkx/blob/0c503e31ba0062dc9a4ed47c380481aa8d6978c8/networkx/algorithms/dag.py
  const reduction: Record<string, string[]> = Object.fromEntries(
    Object.keys(graph).map((k) => [k, []])
  );
  const check_count = inDegrees(graph);
  const prev_size = edgeCount(graph);

  const descendants: Map<string, Set<string>> = new Map();

  for (let u of Object.keys(graph)) {
    let u_nbrs = new Set(graph[u]);

    for (let v of graph[u]) {
      if (u_nbrs.has(v)) {
        if (!descendants.has(v)) {
          descendants.set(v, new Set(dfs(graph, v)));
        }
        subtract(u_nbrs, descendants.get(v) ?? []);
      }
      check_count[v] -= 1;
      if (check_count[v] === 0) {
        descendants.delete(v);
      }
    }
    for (let v of u_nbrs.values()) {
      reduction[u].push(v);
    }
  }

  const new_size = edgeCount(reduction);
  return prev_size === new_size ? graph : reduction;
}