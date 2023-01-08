const db = CyclicDb("ruby-uninterested-chameleonCyclicDB")
const bank = db.collection('bank')

module.exports = {
    description: "돈 두배로 불려줄꺼긴 한데 내 기분에 따라 두배로 줄을 수도 있음 ㅋ",
    options: [{
        name: '얼마',
        description: '쫄? 상남자는 자신있게 올인 ㄱ',
        required: true
    }],
    run: async (interaction, res, wallet) => {
        if (wallet.money < interaction.data.options[0].value) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: '사기치지 마라 니 돈 그만큼 없잖아',
                },
            });
        }
        if (Math.round(Math.random())) {
            await bank.set(interaction.member.user.id, {
                money: wallet.money + interaction.data.options[0].value
            })
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: 'ㅊㅋ 돈 2배됨',
                },
            });
        } else {
            await bank.set(interaction.member.user.id, {
                money: wallet.money - Math.ceil(interaction.data.options[0].value)
            })
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: '엌ㅋㅋㅋ 님 돈 꼴음 ㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
                },
            });
        }
    }
}