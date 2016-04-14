var parseString = require('xml2js').parseString;
var fs = require('fs');


fs.readFile('data.xml', 'utf8', function (err, str) {
    parseString(str, function (err, xml) {
        var questions = [];
        xml.bwContent.slidebank[0].slides[0].slide.forEach(slide=> {
            var interaction = slide.interactions[0].interaction[0];

            var question = {
                text: interaction.$.lmstext,
                type: interaction.$.type,
                choices: interaction.choices[0].choice.map(choice => {
                    return {
                        id: choice.$.id.substr(7),
                        text: choice.$.lmstext
                    }
                }),
                $: Object
            };
            var answers = {};
            interaction.answers[0].answer.forEach(answer=> {
                if (answer.evaluate[0].other)
                    answers['other'] = answer.$.status;
                else
                    answer.evaluate[0].equals.forEach(eq=> {
                        answers[eq.$.choiceid.substr(15)] = answer.$.status;
                    });
            });

            question.choices.forEach(choice=> {
                choice.status = answers[choice.id] || answers['other'];
                if (!choice.status)
                    debugger;
            });

            questions.push(question);
        });
        fs.writeFileSync('questions.json', JSON.stringify(questions, null, '\t'), 'utf8');
        debugger;
    });

});