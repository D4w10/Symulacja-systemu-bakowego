
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
  });


exports.getGoals = async (req, res) => {
  const userId = req.userid.id;

  try {
    const goalsQuery = 'SELECT * FROM goals WHERE user_id = ?';
    await db.query(goalsQuery, [userId],(error,goals)=>{
        console.log("-=--==-----------==============================");
    console.log(goals);
    res.render('goals', { goals });


    });


  


  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania celów:', error);
    res.status(500).json({ success: false, message: 'Wystąpił błąd podczas pobierania celów.' });
  }
};

exports.createGoal = async (req, res) => {
  const userId = req.user.id;
  const { goalName, description, targetAmount, startDate, endDate } = req.body;

  try {
    const createGoalQuery = 'INSERT INTO goals (user_id, goal_name, description, target_amount, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(createGoalQuery, [userId, goalName, description, targetAmount, startDate, endDate]);

    res.redirect('/goals');
  } catch (error) {
    console.error('Wystąpił błąd podczas tworzenia celu:', error);
    res.status(500).json({ success: false, message: 'Wystąpił błąd podczas tworzenia celu.' });
  }
};

exports.depositToGoal = async (req, res) => {
    const userId = req.userid.id;
    const goalId = req.params.id;
    const amount = parseFloat(req.body.amount);
  console.log("dsaaaaaaaaaaaaaaaaaaaaaaaaaagasdsdfgasdgfgsf");
  console.log(goalId);
    try {
      await db.beginTransaction();
  
      // Pobranie aktualnych informacji o celu
      const selectGoalQuery = 'SELECT * FROM goals WHERE id_goal = ? FOR UPDATE';
      await db.query(selectGoalQuery, [goalId], async (error, goal)=>{
        
      if (!goal) {
        throw new Error('Cel nie istnieje.');
      }
  
      const SelectAccounQuery = 'SELECT * FROM account WHERE user_id = ?'; 
      await db.query(SelectAccounQuery, [goal[0].user_id], async (error, account)=>{



    // Aktualizacja stanu celu
    if(account[0].bilans < amount){

      const goalsQuery = 'SELECT * FROM goals WHERE user_id = ?';
    await db.query(goalsQuery, [userId],(error,goals)=>{
       
      res.render('goals',{
        message: "Brak wystarczającej ilości środków na koncie",
        goals
      })

      });


    }else{
          const updatedCurrentAmount = goal[0].current_amount + amount;
          console.log("dsaaaaaaaaaaaaaaaaaaaaaaaaaagasdsdfgasdgfgsf");
          console.log(updatedCurrentAmount);
          const updateGoalQuery = 'UPDATE goals SET current_amount = ? WHERE id_goal = ?';
          await db.query(updateGoalQuery, [updatedCurrentAmount, goalId]);
          const updateAccountAmount = account[0].bilans - amount;
          const updateAccountQuery = 'UPDATE account SET bilans = ? WHERE user_id = ? ';
          await db.query(updateAccountQuery, [updateAccountAmount, account[0].user_id]);



          // Dodanie informacji o transakcji do tabeli transactions (opcjonalnie)
      
          await db.commit();
         
      const goalsQuery = 'SELECT * FROM goals WHERE user_id = ?';
      await db.query(goalsQuery, [userId],(error,goals)=>{
         
        res.render('goals',{
          message2: "Pomyślnie dodano środki do celu",
          goals
        })
  
        });
       }
          });
      


      });


     



    } catch (error) {
      await db.rollback();
  
      console.error('Wystąpił błąd podczas wpłacania środków do celu:', error);
      res.status(500).json({ success: false, message: 'Wystąpił błąd podczas wpłacania środków do celu.' });
    }
  };
  

  exports.withdrawFromGoal = async (req, res) => {
    const userId = req.userid.id;
    const goalId = req.params.id;
    const amount = parseFloat(req.body.amount);
  
    try {
      await db.beginTransaction();
  
      // Pobranie aktualnych informacji o celu
      const selectGoalQuery = 'SELECT * FROM goals WHERE id_goal = ? FOR UPDATE';
      await db.query(selectGoalQuery, [goalId], async (error,goal)=>{

         if (!goal) {
        throw new Error('Cel nie istnieje.');
      }
  

      const SelectAccounQuery = 'SELECT * FROM account WHERE user_id = ?'; 
      await db.query(SelectAccounQuery, [goal[0].user_id], async (error, account)=>{

    if (amount > goal[0].current_amount) {
        const goalsQuery = 'SELECT * FROM goals WHERE user_id = ?';
      await db.query(goalsQuery, [userId],(error,goals)=>{
       
      res.render('goals',{
        message: "Brak wystarczającej ilości środków w celu",
        goals
      })

      });
      }else{
         // Aktualizacja stanu celu
      const updatedCurrentAmount = goal[0].current_amount - amount;
      const updateGoalQuery = 'UPDATE goals SET current_amount = ? WHERE id_goal = ?';

      await db.query(updateGoalQuery, [updatedCurrentAmount, goalId]);
      const updateAccountAmount = account[0].bilans + amount;
          const updateAccountQuery = 'UPDATE account SET bilans = ? WHERE user_id = ? ';
          await db.query(updateAccountQuery, [updateAccountAmount, account[0].user_id]);
      // Dodanie informacji o transakcji do tabeli transactions (opcjonalnie)
  
      await db.commit();

    
      const goalsQuery = 'SELECT * FROM goals WHERE user_id = ?';
    await db.query(goalsQuery, [userId],(error,goals)=>{
       
      res.render('goals',{
        message2: "Pomyślnie wypłacono środki",
        goals
      })

      });
        
      }
  

      });


      
      });
  
     
    } catch (error) {
      await db.rollback();
  
      console.error('Wystąpił błąd podczas wypłacania środków z celu:', error);
      res.status(500).json({ success: false, message: 'Wystąpił błąd podczas wypłacania środków z celu.' });
    }
  };

  exports.deleteGoal = async (req, res) => {
    const goalId = req.params.id;
    const userId = req.userid.id;
    
  
    try {
      await db.beginTransaction();
  
      // Pobierz aktualny stan celu
      const selectGoalQuery = 'SELECT * FROM goals WHERE id_goal = ?';
      await db.query(selectGoalQuery, [goalId], async (error,goal)=>{
        if (!goal) {
        throw new Error('Cel nie istnieje.');
      }
       const amountToReturn = goal[0].current_amount;
      // Aktualizuj stan konta użytkownika, dodając środki z celu
      const updateUserBalanceQuery = 'UPDATE account SET bilans = bilans + ? WHERE user_id = ?';
      await db.query(updateUserBalanceQuery, [amountToReturn, userId]);
  
      // Zapisz transakcję do tabeli transactions
      // const transactionQuery = 'INSERT INTO transactions (sender_id, recipient_id, amount, sender_account_number, recipient_account_number, descrip) VALUES (?, ?, ?, ?, ?, ?)';
      // await db.query(transactionQuery, [userId, userId, amountToReturn, 'Konto celu', 'Konto użytkownika', 'Zwrot środków z usuniętego celu']);
  
      // Usuń cel
      const deleteGoalQuery = 'DELETE FROM goals WHERE id_goal = ?';
      await db.query(deleteGoalQuery, [goalId]);
  
      await db.commit();

      
      const goalsQuery = 'SELECT * FROM goals WHERE user_id = ?';
      await db.query(goalsQuery, [userId],(error,goals)=>{
         
        res.render('goals',{
          message2: "Cel został usunięty",
          goals
        })
  
        });
      });
  
      




    } catch (error) {
      await db.rollback();
  
      console.error('Wystąpił błąd podczas usuwania celu:', error);
      res.status(500).json({ success: false, message: 'Wystąpił błąd podczas usuwania celu.' });
    }
  };
  
