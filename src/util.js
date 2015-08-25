var util = {};

util.tags = { verbs: ["VB", "VBD", "VBN", "VBP", "VBZ", "VBF", "CP", "VBG"],
    adjectives: ["JJ", "JJR", "JJS"],
    adverbs: ["RB", "RBR", "RBS"],
    nouns: ["NN", "NNP", "NNPA", "NNAB", "NNPS", "NNS", "NNO", "NG", "PRP", "PP"],
    glue: ["FW", "IN", "MD", "CC", "DT", "UH", "EX"],
    value: ["CD", "DA", "NU"],
}
util.tags.allTags = util.tags.verbs.concat(util.tags.adjectives).concat(util.tags.adverbs).concat(util.tags.nouns).concat(util.tags.glue).concat(util.tags.value);

module.exports = util;