export const mockedUser = {
    "identityId": "eu-west-2:1ce41008-3355-4013-aa65-dd7b393d661e",
};
export const otherTeamPlayingMockedUser = {
    "identityId": "eu-west-2:1ce41008-3355-4013-aa65-dd7b393d661e",
};
export const guessingMockedUser = {
    "identityId": "eu-west-2:93a24318-132b-4188-86ca-b8e96208cb4f",
};
export const myTurnMockedUser = {
    "identityId": "eu-west-2:8ba9fc93-ed09-4a54-bf83-3a6d1108aa78",
};

export const mockGameId = "AAAA";
export const nonExistentGame = {gameNotFound: true};
export const mockedRoundsFirstActive = [
    {
        "roundNo": 1,
        "roundType": "DESCRIBE",
        "roundStatus": "Active",
        "score": {
            "team 1": 18,
            "team 2": 0
        },
        "wordsLeft": [
            "hmm1",
            "hmm2"]
    },
    {
        "roundNo": 2,
        "roundType": "MIME",
        "roundStatus": "Pending",
        "score": {
            "team 1": 0,
            "team 2": 0
        }
    },
    {
        "roundStatus": "Pending",
        "score": {
            "team 2": 0,
            "team 1": 0
        },
        "roundNo": 3,
        "roundType": "WORD",
    },
    {
        "roundStatus": "Pending",
        "score": {
            "team 2": 0,
            "team 1": 0
        },
        "roundNo": 4,
        "roundType": "SOUNDS",

    }];
export const mockedRoundsGameEnded = [
    {
        "roundNo": 1,
        "roundType": "DESCRIBE",
        "roundStatus": "Ended",
        "score": {
            "team 1": 18,
            "team 2": 2
        },
    },
    {
        "roundNo": 2,
        "roundType": "MIME",
        "roundStatus": "Ended",
        "score": {
            "team 1": 12,
            "team 2": 10
        }
    },
    {
        "roundStatus": "Ended",
        "score": {
            "team 2": 20,
            "team 1": 0
        },
        "roundNo": 3,
        "roundType": "WORD",
    },
    {
        "roundStatus": "Ended",
        "score": {
            "team 2": 10,
            "team 1": 10
        },
        "roundNo": 4,
        "roundType": "SOUNDS",

    }];
export const mockedGame = {
    gameStatus: "Active",
    creator: "eu-west-2:93a24318-132b-4188-86ca-b8e96208cb4f",
    players: {
        ids: [
            "eu-west-2:93a24318-132b-4188-86ca-b8e96208cb4f",
            "eu-west-2:1ce41008-3355-4013-aa65-dd7b393d661e",
            "eu-west-2:8ba9fc93-ed09-4a54-bf83-3a6d1108aa78",
            "eu-west-2:b4a9a74d-434d-4664-9f5a-5c1e524863c5"
        ],
        playerNames: [
            "hmm",
            "deea0",
            "newu",
            "Andrdim"
        ]
    },
    "turnNumber": 2,
    "rounds": [
        {
            "roundNo": 1,
            "roundType": "DESCRIBE",
            "roundStatus": "Ended",
            "score": {
                "team 1": 20,
                "team 2": 0
            }
        },
        {
            "roundNo": 2,
            "roundType": "MIME",
            "roundStatus": "Active",
            "score": {
                "team 1": 0,
                "team 2": 2
            },
            "wordsLeft": [
                "hmm1",
                "hmm2",
                "hmm3",
                "hmm4",
                "hmm5",
                "deea01",
                "deea02",
                "deea03",
                "deea04",
                "deea05",
                "newu1",
                "newu2",
                "newu4",
                "newu5",
                "andradim1",
                "andradim2",
                "andradim4",
                "andradim5"
            ]
        },
        {
            "roundStatus": "Pending",
            "score": {
                "team 2": 0,
                "team 1": 0
            },
            "roundNo": 3,
            "roundType": "WORD",
        },
        {
            "roundStatus": "Pending",
            "score": {
                "team 2": 0,
                "team 1": 0
            },
            "roundNo": 4,
            "roundType": "SOUNDS",

        }
    ],
    "createdAt": 1620141262829,
    "gameName": "wes",
    "teams": {
        "team 1": {
            "members": {
                "eu-west-2:93a24318-132b-4188-86ca-b8e96208cb4f": {
                    "playerName": "hmm",
                    "playerId": "eu-west-2:93a24318-132b-4188-86ca-b8e96208cb4f"
                },
                "eu-west-2:8ba9fc93-ed09-4a54-bf83-3a6d1108aa78": {
                    "playerName": "newu",
                    "playerId": "eu-west-2:8ba9fc93-ed09-4a54-bf83-3a6d1108aa78"
                }
            }
        },
        "team 2": {
            "members": {
                "eu-west-2:1ce41008-3355-4013-aa65-dd7b393d661e":
                    {
                        "playerName": "deea0",
                        "playerId": "eu-west-2:1ce41008-3355-4013-aa65-dd7b393d661e"
                    },
                "eu-west-2:b4a9a74d-434d-4664-9f5a-5c1e524863c5":
                    {
                        "playerName": "Andrdim",
                        "playerId": "eu-west-2:b4a9a74d-434d-4664-9f5a-5c1e524863c5"
                    }
            }
        }
    },
    "SK": "#METADATA#000001#HTAP",
    "PK": "GAME#000001#HTAP",
    "gameType": "000001",
    "gameId": mockGameId,
    "words": [
        "hmm1",
        "hmm2",
        "hmm3",
        "hmm4",
        "hmm5",
        "deea01",
        "deea02",
        "deea03",
        "deea04",
        "deea05",
        "newu1",
        "newu2",
        "newu3",
        "newu4",
        "newu5",
        "andradim1",
        "andradim2",
        "andradim3",
        "andradim4",
        "andradim5"
    ],
    "noRounds": 4,
    "connectionIds": [
        "",
        "e0BwYcCPLPECHNw=",
        "e0JeCcnnLPECGjQ=",
        "e0Nd9cmiLPECHSw=",
        "e0NmFe_RrPECFhQ=",
        "e0NmLccnLPECFYQ=",
        "e0TPDc4RrPECGjQ=",
        "ez33mfAsLPECFYQ=",
        "ez3e2cUsrPECGGg=",
        "ez5WFdt-LPECGLA=",
        "ez5Z6eh2LPECHLw="
    ]
};
export const pendingGame={
    "gameStatus": "Pending",
    "creator": "eu-west-2:07d255b8-21f3-4bbf-b824-4ab89bc10dd2",
    "players": {
    "ids": [
        "eu-west-2:07d255b8-21f3-4bbf-b824-4ab89bc10dd2"
    ],
        "playerNames": [
        "hmm"
    ]
},
    "turnNumber": 0,
    "rounds": [
    {
        "roundStatus": "Pending",
        "score": {
            "team1": 0,
            "team2": 0
        },
        "roundNo": 1,
        "roundType": "DESCRIBE"
    },
    {
        "roundStatus": "Pending",
        "score": {
            "team1": 0,
            "team2": 0
        },
        "roundNo": 2,
        "roundType": "MIME"
    },
    {
        "roundStatus": "Pending",
        "score": {
            "team1": 0,
            "team2": 0
        },
        "roundNo": 3,
        "roundType": "WORD"
    },
    {
        "roundStatus": "Pending",
        "score": {
            "team1": 0,
            "team2": 0
        },
        "roundNo": 4,
        "roundType": "SOUNDS"
    }
],
    "createdAt": 1637759515830,
    "gameName": "November twenty fourth",
    "teams": {
    "team1": {
        "members": {
            "eu-west-2:07d255b8-21f3-4bbf-b824-4ab89bc10dd2": {
                "playerName": "hmm",
                    "playerId": "eu-west-2:07d255b8-21f3-4bbf-b824-4ab89bc10dd2"
            }
        }
    },
    "team2": {
        "members": {}
    }
},
    "SK": "#METADATA#000001#ECPX",
    "PK": "GAME#000001#ECPX",
    "gameType": "000001",
    "gameId": "ECPX",
    "words": [
    "hmmone",
    "hmmto",
    "hmmthe",
    "hmmfor",
    "hmmfive"
],
    "noRounds": 4,
    "connectionIds": [
    "JT-IveIirPECEtA=",
    "JT33uec9rPECEMQ=",
    "JT5tndS-rPECJPg=",
    "JT7L-cA6LPECG4w=",
    "JT8qZfH6LPECIpA=",
    "JT_nHf40LPECHpA=",
    "JU-gddKprPECGEw=",
    "JU0Kwc7orPECItA=",
    "JU1pcevDLPECHpA=",
    "JU3HzfHLLPECItA=",
    "JU4mfejhLPECJRA=",
    "JU6E3eWfLPECGIg=",
    "JU7jaf7ILPECJRA=",
    "JU9CEex_LPECJCg=",
    "JUBFsfJ4rPEAd6g=",
    "JUCkLfBdLPECEtA=",
    "JUECkeWSLPECFxQ=",
    "JUFg7eIXrPECGEw=",
    "JUG_Ses0LPECICQ=",
    "JUId8eDjLPECHpA=",
    "JUJ8VenSrPECGEw=",
    "JULa7dPVLPECEMQ=",
    "JUM5PfFZLPECIpA=",
    "JUOXpeZ2LPEAbLQ=",
    "JUP2Afr3rPECIpA=",
    "JURUYfVsrPECGEw=",
    "JUSywclLrPEAd6g=",
    "JUURHde3rPEAbLQ=",
    "JUVvfdJ9LPECG4w=",
    "JUXN3cIrLPECItA=",
    "JUYsPc2mLPECHpA=",
    "JU__HcIlrPEAbLQ=",
    "JUaKmcKzLPEAbLQ=",
    "JUbo_fRErPECFbA=",
    "JUdHif8yLPEAd6g=",
    "JUdJjdYQrPECEMQ=",
    "JUg-BfpNrPECICQ=",
    "JUicaeKZrPECEMQ=",
    "JUj7FfigrPEAbLQ=",
    "JUlZddCsLPECHpA=",
    "JUm4BfBurPECEtA=",
    "JUoWid6wLPEAbLQ=",
    "JUp1MflNLPECICQ=",
    "JUrTmegNrPEAbLQ=",
    "JUsyRd91rPECIpA=",
    "JUuQoe_qLPEAd6g=",
    "JUvvTdClLPECFbA=",
    "JUxNtcderPECG4w=",
    "JUysYflCLPECG9w=",
    "JVBdgcUNrPECItA=",
    "JVC8NeZNLPECF3g=",
    "JVEajetBLPECFVw=",
    "JVF5Qfe0rPECGEw=",
    "JVHXmcRwLPECG9w=",
    "JiU1_cB1LPECFVw=",
    "JrB1AeFhrPECEQQ=",
    "JrByLcbsLPECIPw=",
    "JrCUEfD0rPEAbkQ=",
    "JrCllc6bLPECJPA=",
    "JrCngcuVLPECF1w=",
    "JrCySfasLPECHyg=",
    "JrDGQd4WrPEAc3Q=",
    "JrDJLcsqrPECJog=",
    "JrDPYfLUrPECIPw=",
    "JrDQafTCrPECIPw=",
    "JrDT_fc0rPECF2A="
]
};