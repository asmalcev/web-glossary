const loadDictionary = require('./loadDictionary');

const createMermaid = (callback) => {
    const dictionary = {
        current: null,
    };

    loadDictionary('dictionary.json', dictionary, () => {
        const connections = dictionary.current.__connections;

        const mindmap = {};

        for (const connection in connections) {
            const parent = connections[connection];

            if (mindmap[parent]) {
                mindmap[parent].push(connection);
            } else {
                mindmap[parent] = [connection];
            }
        }

        const output = [];

        const dfs = (node, tabs) => {
            if (node === '__root') {
                output.push('\t'.repeat(tabs) + 'root((mindmap))');
            } else {
                output.push('\t'.repeat(tabs) + dictionary.current[node].name);
            }

            if (mindmap[node]) {
                for (const child of mindmap[node]) {
                    dfs(child, tabs + 1);
                }
            }
        };

        output.push('mindmap');
        dfs('__root', 1);

        callback(output.join('\n'));
    });
};

module.exports = createMermaid;
