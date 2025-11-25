import { GraphBuilder } from '@/orchestrators/graph/builder/GraphBuilder';
import { GraphEngine } from '@/orchestrators/graph/core/GraphEngine';
import { GraphNode } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';

describe('GraphBuilder', () => {
    let builder: GraphBuilder;

    beforeEach(() => {
        builder = new GraphBuilder();
    });

    describe('addNode', () => {
        it('should add a node to the graph', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('testNode', node);
            // Since nodes are private, we can verify by trying to add an edge to it
            // or by checking if build succeeds
            expect(() => builder.setEntry('testNode')).not.toThrow();
        });

        it('should throw if node name is empty', () => {
            const node: GraphNode = async () => ({});
            expect(() => builder.addNode('', node)).toThrow();
        });
    });

    describe('addEdge', () => {
        it('should add an edge between two nodes', () => {
            const node1: GraphNode = async () => ({});
            const node2: GraphNode = async () => ({});
            builder.addNode('node1', node1);
            builder.addNode('node2', node2);
            expect(() => builder.addEdge('node1', 'node2')).not.toThrow();
        });

        it('should throw if from node does not exist', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('node2', node);
            expect(() => builder.addEdge('node1', 'node2')).toThrow();
        });

        it('should throw if to node does not exist', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('node1', node);
            expect(() => builder.addEdge('node1', 'node2')).toThrow();
        });
    });

    describe('addConditionalEdge', () => {
        it('should add a conditional edge', () => {
            const node1: GraphNode = async () => ({});
            const node2: GraphNode = async () => ({});
            const node3: GraphNode = async () => ({});
            builder.addNode('node1', node1);
            builder.addNode('node2', node2);
            builder.addNode('node3', node3);

            const condition = (state: any) => 'node2';
            expect(() => builder.addConditionalEdge('node1', condition, { node2: 'node2', node3: 'node3' })).not.toThrow();
        });
    });

    describe('setEntry', () => {
        it('should set the entry point', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('start', node);
            expect(() => builder.setEntry('start')).not.toThrow();
        });

        it('should throw if entry node does not exist', () => {
            expect(() => builder.setEntry('non-existent')).toThrow();
        });
    });

    describe('setFinish', () => {
        it('should set the finish point', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('end', node);
            expect(() => builder.setFinish('end')).not.toThrow();
        });

        it('should throw if finish node does not exist', () => {
            expect(() => builder.setFinish('non-existent')).toThrow();
        });
    });

    describe('build', () => {
        it('should build a GraphEngine instance', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('start', node);
            builder.addNode('end', node);
            builder.setEntry('start');
            builder.setFinish('end');
            builder.addEdge('start', 'end');

            const engine = builder.build();
            expect(engine).toBeInstanceOf(GraphEngine);
        });

        it('should throw if entry point is not set', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('start', node);
            expect(() => builder.build()).toThrow();
        });

        it('should throw if finish point is not set', () => {
            const node: GraphNode = async () => ({});
            builder.addNode('start', node);
            builder.setEntry('start');
            expect(() => builder.build()).toThrow();
        });
    });
});
