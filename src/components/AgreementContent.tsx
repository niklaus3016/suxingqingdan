import React from 'react';

/**
 * 隐私政策详细内容
 */
export function PrivacyPolicyContent() {
  return (
    <div className="max-w-none prose prose-sm dark:prose-invert">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center mb-2">🔒 隐私政策</h1>
      <p className="text-center text-gray-500 dark:text-zinc-500 mb-6"><strong>生效日期</strong>：2026年06月11日</p>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-6 rounded-lg border-l-4 border-blue-600 dark:border-blue-500 mb-6">
        <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
          欢迎使用「速行清单」（以下简称"本应用"）。本应用由<strong>深圳丰佰瑞网络科技有限公司</strong>（以下简称"我们"）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。
        </p>
      </div>

      <p className="mb-6 text-gray-700 dark:text-zinc-300 leading-relaxed">
        本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        一、我们收集的信息
      </h2>
      <p className="mb-4 text-gray-700 dark:text-zinc-300">在您使用本应用的过程中，我们会收集以下信息，以提供、维护和改进我们的服务：</p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>待办事项数据</strong>：您在使用本应用过程中主动录入的所有<strong>待办事项标题、备注内容、完成状态、分类信息及相关数据</strong>。这些数据是本应用的核心功能内容，用于为您提供清单管理、任务追踪和历史记录服务。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>设备信息</strong>：为了保障应用的稳定运行和优化用户体验，我们会自动收集您的设备相关信息，包括但不限于<strong>设备型号、操作系统版本、设备标识符（如Android ID）、屏幕分辨率</strong>等。
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        二、我们如何使用收集的信息
      </h2>
      <p className="mb-4 text-gray-700 dark:text-zinc-300">我们仅会在以下合法、正当、必要的范围内使用您的个人信息：</p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>提供和改进服务</strong>：使用您的待办事项数据来实现清单管理、任务追踪、分类筛选等核心功能；通过分析设备信息和使用数据，优化应用性能，修复已知问题，提升用户体验。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>数据分析和统计</strong>：在对您的个人信息进行匿名化或去标识化处理后，进行内部数据分析和统计，以了解用户群体的使用习惯和需求，从而更好地规划和改进产品功能。
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        三、我们如何共享、转让和公开披露信息
      </h2>
      <p className="mb-4 text-gray-700 dark:text-zinc-300">我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：</p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>法定情形</strong>：根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>获得明确同意</strong>：在获得您的明确书面同意后，我们才会向第三方共享您的个人信息。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>业务必要且合规</strong>：为了实现本政策第二条所述的目的，我们可能会与提供技术支持或其他必要服务的合作伙伴共享必要的信息，但我们会要求其严格遵守本政策及相关法律法规，并对您的信息承担保密义务。
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        四、我们如何存储和保护信息
      </h2>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>存储地点和期限</strong>：您的个人信息将存储于您的设备本地（LocalStorage），不会上传至任何云端服务器。我们会在实现本政策所述目的所必需的最短时间内保留您的信息，超出此期限后，您可以通过应用内的删除功能或清除应用数据来移除相关信息。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>安全措施</strong>：我们采用符合行业标准的技术手段和安全管理措施来保护您的个人信息，包括但不限于数据加密、访问控制、安全审计等，以防止信息泄露、丢失、篡改或被未经授权的访问。
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        五、您的权利
      </h2>
      <p className="mb-4 text-gray-700 dark:text-zinc-300">根据相关法律法规，您对您的个人信息享有以下权利：</p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>访问权</strong>：您可以随时在本应用中查看和管理您的待办事项及历史记录。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>更正权</strong>：如您发现您的待办事项存在错误，您可以在应用内进行修改和更正。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>删除权</strong>：您可以随时删除单条待办事项或整个分类，应用将立即删除相关数据。
        </li>
        <li className="text-gray-700 dark:text-zinc-300">
          <strong>数据导出</strong>：本应用所有数据存储在您的设备本地，您可以通过应用内的备份导出功能或设备备份等方式导出您的数据。
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        六、未成年人保护
      </h2>
      <p className="mb-6 text-gray-700 dark:text-zinc-300 leading-relaxed">
        我们非常重视对未成年人个人信息的保护。如您是未满14周岁的未成年人，在使用本应用前，应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，将立即删除相关数据。
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        七、本政策的更新
      </h2>
      <p className="mb-6 text-gray-700 dark:text-zinc-300 leading-relaxed">
        我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。如您继续使用本应用，即表示您同意接受修订后的政策。
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 dark:border-zinc-800 pb-2 text-gray-900 dark:text-zinc-100">
        八、联系我们
      </h2>
      <p className="mb-4 text-gray-700 dark:text-zinc-300">如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：</p>
      <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 mb-6">
        <p className="mb-2 text-gray-700 dark:text-zinc-300"><strong>电子邮箱</strong>：Jp182025@163.com</p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">
        <p className="mb-2 text-gray-500 dark:text-zinc-500">感谢您使用速行清单！</p>
        <p className="mb-4 text-gray-500 dark:text-zinc-500">我们致力于为您提供安全、便捷的清单管理服务。</p>
        <p className="text-sm text-gray-400 dark:text-zinc-600">© 2026 深圳丰佰瑞网络科技有限公司 版权所有</p>
      </div>
    </div>
  );
}

/**
 * 用户服务协议详细内容
 */
export function UserAgreementContent() {
  return (
    <div className="max-w-none prose prose-sm dark:prose-invert">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center mb-4">用户服务协议</h1>
      <p className="text-center text-gray-500 dark:text-zinc-500 mb-8">更新日期：2026年6月11日</p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-zinc-100">1. 协议的接受</h2>
      <p className="text-gray-700 dark:text-zinc-300 mb-2">欢迎使用「速行清单」应用（以下简称「本应用」）。</p>
      <p className="text-gray-700 dark:text-zinc-300 mb-2">本协议是您与深圳丰佰瑞网络科技有限公司（以下简称「我们」）之间关于使用本应用的法律协议。</p>
      <p className="text-gray-700 dark:text-zinc-300">通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。</p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-zinc-100">2. 服务内容</h2>
      <p className="text-gray-700 dark:text-zinc-300 mb-3">本应用提供以下服务：</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-zinc-300">
        <li>创建和管理待办事项清单</li>
        <li>记录和分类管理任务</li>
        <li>查看任务历史记录和完成状态</li>
        <li>数据备份和恢复功能</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-zinc-100">3. 用户义务</h2>
      <p className="text-gray-700 dark:text-zinc-300 mb-3">作为本应用的用户，您同意：</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-zinc-300">
        <li>遵守本协议的所有条款</li>
        <li>不使用本应用进行任何非法活动</li>
        <li>不干扰本应用的正常运行</li>
        <li>保护您的设备安全，防止未授权访问</li>
        <li>自行负责备份重要数据，应用数据仅存储在本地</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-zinc-100">4. 知识产权</h2>
      <p className="text-gray-700 dark:text-zinc-300 mb-2">本应用的所有内容，包括但不限于文字、图像、音频、视频、软件等，均受知识产权法律保护。</p>
      <p className="text-gray-700 dark:text-zinc-300">未经我们的书面许可，您不得复制、修改、分发或商业使用本应用的任何内容。</p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-zinc-100">5. 免责声明</h2>
      <p className="text-gray-700 dark:text-zinc-300 mb-2">本应用按「原样」提供，不做任何形式的保证。</p>
      <p className="text-gray-700 dark:text-zinc-300 mb-3">我们不保证：</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-zinc-300">
        <li>本应用将符合您的要求</li>
        <li>本应用将无中断、及时、安全或无错误地运行</li>
        <li>本应用的使用结果将是准确或可靠的</li>
      </ul>
      <p className="text-gray-700 dark:text-zinc-300 mt-3">
        由于本应用数据仅存储在您的设备本地，卸载应用、清除应用数据或更换设备可能导致数据丢失，请您自行承担相关风险。
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-zinc-100">6. 终止</h2>
      <p className="text-gray-700 dark:text-zinc-300 mb-2">我们有权在任何时候，出于任何原因，终止或暂停您对本应用的访问。</p>
      <p className="text-gray-700 dark:text-zinc-300">您也可以随时停止使用本应用。</p>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-zinc-100">7. 适用法律</h2>
      <p className="text-gray-700 dark:text-zinc-300 mb-2">本协议受中华人民共和国法律管辖。</p>
      <p className="text-gray-700 dark:text-zinc-300">任何与本协议相关的争议，应通过友好协商解决；协商不成的，应提交至深圳市有管辖权的人民法院诉讼解决。</p>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">
        <p className="text-sm text-gray-400 dark:text-zinc-600">© 2026 深圳丰佰瑞网络科技有限公司 版权所有</p>
      </div>
    </div>
  );
}