const assert    = require('assert') ;
const ganache   = require('ganache-cli') ;
const Web3      = require('web3') ;
const web3      = new Web3(ganache.provider()) ;

const { interface, bytecode }   = require('../compile') ;

let lottery ;
let accounts ;

beforeEach(
    async ()    => {
        accounts= await web3.eth.getAccounts() ;
        
        lottery = await new web3.eth.Contract(
            JSON.parse(
                interface
            )
        )
            .deploy(
                { data  : bytecode }
            )
            .send(
                { 
                    from    : accounts[0], 
                    gas     : '1000000'
                }
            ) ;     
    }
) ;

describe(
    'Lotter contract!', 
    ()  => {

        it(
            'deploys a contract', 
            ()  => {
                assert.ok(
                    lottery.options.address
                ); 
            }
        );
    
        it(
            'manager can not enter', 
            async ()    => {
                try {
                    await lottery.methods.Enter().send(
                        {
                            from    : accounts[0],
                            value   : web3.utils
                                        .toWei(
                                            '0.011', 
                                            'ether'
                                        )
                        }
                    );
                    assert(
                        false
                    );
                } 
                catch (error) {
                    assert(
                        error
                    );
                }
            }
        );
    
        it(
            'requires a minimum amount of ether to enter', 
            async ()    => {
                try {
                    await lottery.methods.Enter().send(
                        {
                            from    : accounts[1],
                            value   : 0
                        }
                    );
                    assert(
                        false
                    );
                } catch (error) {
                    assert(
                        error
                    );
                } 
            }
        );
    
        it(
            'enter multipal entery', 
            async ()    => {
                await lottery.methods.Enter().send(
                    {
                        from    : accounts[1],
                        value   : web3.utils
                                    .toWei(
                                        '0.011', 
                                        'ether'
                                    )
                    }
                );
                await lottery.methods.Enter().send(
                    {
                        from    : accounts[2],
                        value   : web3.utils
                                    .toWei(
                                        '0.011', 
                                        'ether'
                                    )
                    }
                );
        
                const players = await lottery.methods.getPlayers()
                                        .call(
                                            {
                                                from    : accounts[0]
                                            }
                                        );
        
                assert.equal(
                    accounts[1], 
                    players[0]
                );
                assert.equal(
                    accounts[2], 
                    players[1]
                );
        
                assert.equal(
                    2, 
                    players.length
                ); 
            }
        );
    
        it(
            'only manager can call pickwinner', 
            async ()    => {
                try {
                    await lottery.methods.pickWinner().send(
                        {
                            from    : accounts[1] 
                        }
                    );
                    assert(
                        false
                    );
                } 
                catch (error) {
                    assert(
                        error
                    );
                }
            }
        );
    
    
    }
) ;