/**
 * Created by Liu on 2019/9/11.
 */
import Dexie from 'dexie';

const db = new Dexie('timer');
/**
 * @PrimaryKey { number } id Autoincremented and unique
 * @Indexes { string } title 任务标题
 * @Indexes { string } createdTime 任务创建时间，格式：'YYYY-MM-DD HH:mm:ss'
 * @Indexes { string } targetTime 任务结束时间，格式：'YYYY-MM-DD HH:mm:ss'
 * @Indexes { array } histories 任务历史信息
 * @Indexes { string } mode 任务类型['1': 通过截止时间添加, '2': 通过任务时长添加]
 // * @Indexes { number } done 是否完成[0: 未完成, 1: 已完成]
 * */
db.version(1).stores({
  tasks: '++id, &title, createdTime, targetTime, *histories, mode'
});

export function queryTasksWhereLaterThanGivenTime (timeStamp) {
  return db.tasks.where('targetTime').above(timeStamp).toArray();;
}

export function addTask ({ title, createdTime, targetTime, histories = [], done, mode }) {
  return db.tasks.add({ title, createdTime, targetTime, histories, done, mode });
}

export function deleteTask (id) {
  return db.tasks.delete(id);
}

export function updateTask ({ title, createdTime, targetTime, histories = [], done, mode }) {
  return db.tasks.put({ title, createdTime, targetTime, histories, done, mode });
}

/*
export async function test () {
  // table.where(indexOrPrimKey).equals(key)
  const id = await db.tasksa.put({ date: Date.now(), description: 'Test Dexie', done: 0 });
  console.log(`Got id ${  id}`);
  // Now lets add a bunch of tasks
  await db.tasksa.bulkPut([
    { date: Date.now(), description: 'Test Dexie bulkPut()', done: 1 },
    { date: Date.now(), description: 'Finish testing Dexie bulkPut()', done: 1 }
  ]);
  // Ok, so let's query it

  const tasks = await db.tasksa.where('done').above(0).toArray();
  console.log(`Completed tasks: ${  JSON.stringify(tasks, 0, 2)}`);

  // Ok, so let's complete the 'Test Dexie' task.
  await db.tasksa
    .where('description')
    .startsWithIgnoreCase('test dexi')
    .modify({ done: 1 });

  console.log('All tasks should be completed now.');
  console.log('Now let\'s delete all old tasks:');

  // And let's remove all old tasks:
  await db.tasksa
    .where('date')
    .below(Date.now())
    .delete();

  console.log('Done.');
}

test().catch(err => {
  console.error(`Uh oh! ${  err.stack}`);
});
*/
