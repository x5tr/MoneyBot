module.exports = {
    description: "니 쬐@@끄만한 지갑에 얼마 있는지 보여줌 ㅋ",
    options: [],
    run: async (interaction, res, wallet) => {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `어디보자.... ㅋ ${wallet.money}원 밖에 없누 ㅋ 거지샊 ㅋ`,
            },
        });
    }
}