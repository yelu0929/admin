// import { MenuDataItem } from '@ant-design/pro-layout';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectProps, connect } from 'umi';
import React from 'react';
import SelectLang from '@/components/SelectLang';
import { ConnectState } from '@/models/connect';
import styles from './UserLayout.less';

// export interface UserLayoutProps extends Partial<ConnectProps> {
//   breadcrumbNameMap: {
//     [path: string]: MenuDataItem;
//   };
// }

const UserLayout: React.FC<ConnectProps> = (props) => {

  const {
    children,
  } = props;
  return (
    <HelmetProvider>
      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
